/** Domain models as seen by the frontend (mirror the API response shapes). */

export type CrStatus = 'DRAFT' | 'SUBMITTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'APPLIED' | 'REJECTED' | 'CANCELLED';

export interface ReqUser {
	id: string;
	orgCode: string;
	policies: string[]; // e.g. ['cr_r_o', 'cr_a_o'] — see README for the convention
}

export interface LineItem {
	sku: string;
	description: string;
	quantity: number;
	unitPrice: number;
}

export interface CrSummary {
	id: string;
	title: string;
	status: CrStatus;
	orgCode: string;
	delta: number;
	currency: string;
	updatedAt: string; // ISO
}

export interface TimelineEntry {
	action: string;
	byUserId: string;
	at: string; // ISO
	note?: string;
}

export interface CrDetail extends CrSummary {
	agreementId: string;
	baselineLineItems: LineItem[];
	proposedLineItems: LineItem[];
	baselineTotal: number;
	newTotal: number;
	audit: TimelineEntry[];
}
