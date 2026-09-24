import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrListComponent } from '../components/cr-list/cr-list.component';
import { CrDetailComponent } from '../components/cr-detail/cr-detail.component';
import { SessionService } from '../session/session.service';
import { users } from '../api/fixtures';

/**
 * Demo app shell that hosts the list + detail screens so you can click through the UI in a browser
 * (run `npm start`). The "Acting as" switcher changes the current user via SessionService and reloads
 * both panes — handy for demoing permission-aware action states in your walkthrough video.
 *
 * This shell is just glue for the demo; the exercise is the list/detail components and their templates.
 */
@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, CrListComponent, CrDetailComponent],
	templateUrl: './app.component.html',
})
export class AppComponent {
	readonly users = users;
	readonly userKeys = Object.keys(users);
	selectedId: string | null = 'CR-1';
	show = true;

	constructor(public readonly session: SessionService) {}

	switchUser(key: string): void {
		this.session.user = users[key];
		this.reload();
	}

	onSelect(id: string): void {
		this.selectedId = id;
	}

	/** Destroy + recreate the panes so they re-load as the newly selected user. */
	private reload(): void {
		this.show = false;
		setTimeout(() => (this.show = true));
	}
}
