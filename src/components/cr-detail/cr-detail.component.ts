import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrApiService } from '../../api/cr-api.service';
import { SessionService } from '../../session/session.service';
import { CrDetail, TimelineEntry } from '../../models/cr.models';
import { idle, loading, ViewState } from '../../common/view-state';
import { computeDiff, DiffRow } from '../diff.util';
import { formatMoney } from '../../common/money.util';
import { canApprovePolicy } from '../../common/permissions';

/**
 * Change Request DETAIL page: loads a CR and renders the diff/preview, the approval timeline, and
 * permission-aware Approve/Reject actions. `load`, the diff binding, and the template skeleton are
 * provided; the timeline ordering, permission gating, actions, and reject validation are yours.
 */
@Component({
	selector: 'app-cr-detail',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './cr-detail.component.html',
})
export class CrDetailComponent implements OnInit {
	@Input() id!: string;
	@Output() crChanged = new EventEmitter<void>();
	state: ViewState<CrDetail> = idle();
	submitting = false;
	actionError?: string;
	rejectControl = new FormControl('', {
		nonNullable: true,
		validators: [Validators.required, Validators.pattern(/\S/)],
	});

	constructor(private readonly api: CrApiService, private readonly session: SessionService) {}

	ngOnInit(): void {
		void this.load();
	}

	async load(): Promise<void> {
		this.state = loading();
		this.actionError = undefined;
		try {
			const detail = await this.api.getChangeRequest(this.session.user, this.id);
			this.state = { status: 'loaded', data: detail };
		} catch (err) {
			this.state = { status: 'error', data: null, error: (err as Error).message };
		}
	}

	get detail(): CrDetail | null {
		return this.state.data;
	}

	get diff(): DiffRow[] {
		return this.detail ? computeDiff(this.detail.baselineLineItems, this.detail.proposedLineItems) : [];
	}

	/** Approval timeline, oldest-first. */
	get timeline(): TimelineEntry[] {
		const audit = this.detail?.audit ?? [];
		const auditCopy = [...audit];

		auditCopy.sort((a,b) => a.at.localeCompare(b.at))
		return auditCopy;
	}

	/** Whether the current user may approve the loaded CR. */
	get canApprove(): boolean {
		// NOTE: this only looks at the CR status. The UI must also respect the user's permissions.
		return this.detail?.status === 'PENDING_APPROVAL' && canApprovePolicy(this.session.user);
	}

	get canReject(): boolean {
		return this.detail?.status === 'PENDING_APPROVAL' && canApprovePolicy(this.session.user);
	}

	fmt(amount: number): string {
		return this.detail ? formatMoney(amount, this.detail.currency) : String(amount);
	}

	async approve(): Promise<void> {
		try {
			const id = this.detail?.id;
			if (!id || !this.canApprove)
				return;

			this.submitting = true;
			const updated = await this.api.approve(this.session.user, id, new Date().toISOString());

			this.state = {status: 'loaded', data: updated};
			this.crChanged.emit();
		}
		catch (e){
			const message = (e as Error).message;

			await this.load();
			this.actionError = `Couldn't confirm the approval response: ${message}`;
			this.crChanged.emit();
		}
		finally {
			this.submitting = false;
		}
	}

	async reject(): Promise<void> {
		try {
			const id = this.detail?.id;
			if (!id || !this.canReject || this.submitting) {
				return;
			}

			if (this.rejectControl.invalid) {
				this.rejectControl.markAsTouched();
				return;
			}

			this.submitting = true;
			const reason = this.rejectControl.value.trim();
			const updated = await this.api.reject(this.session.user, id, new Date().toISOString(), reason);

			this.state = {status: 'loaded', data: updated};
			this.crChanged.emit();
		}
		catch (e){
			const message = (e as Error).message;

			await this.load();
			this.actionError = `Couldn't confirm the rejection response: ${message}`;
			this.crChanged.emit();
		}
		finally {
			this.submitting = false;
		}
	}
}
