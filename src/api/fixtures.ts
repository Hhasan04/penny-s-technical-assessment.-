import { CrDetail, CrSummary, ReqUser } from '../models/cr.models';

/** Deterministic, anonymized fixtures used by the mock API service and the tests. */

export const users: Record<string, ReqUser> = {
	approver: { id: 'mona', orgCode: 'org-alpha', policies: ['cr_r_o', 'cr_a_o'] },
	viewer: { id: 'val', orgCode: 'org-alpha', policies: ['cr_r_o'] },
	otherOrg: { id: 'bob', orgCode: 'org-beta', policies: ['cr_r_o', 'cr_a_o'] },
};

export const summaries: CrSummary[] = [
	{ id: 'CR-1', title: 'Add 1 unit of SKU-A', status: 'PENDING_APPROVAL', orgCode: 'org-alpha', delta: 500, currency: 'USD', updatedAt: '2026-03-02T10:00:00.000Z' },
	{ id: 'CR-2', title: 'Replace SKU-B supplier', status: 'APPLIED', orgCode: 'org-alpha', delta: 0, currency: 'USD', updatedAt: '2026-03-01T09:00:00.000Z' },
	{ id: 'CR-3', title: 'Extend agreement term', status: 'DRAFT', orgCode: 'org-alpha', delta: 0, currency: 'USD', updatedAt: '2026-03-03T11:00:00.000Z' },
	{ id: 'CR-9', title: 'Beta org change', status: 'PENDING_APPROVAL', orgCode: 'org-beta', delta: 200, currency: 'USD', updatedAt: '2026-03-02T08:00:00.000Z' },
];

export const details: Record<string, CrDetail> = {
	'CR-1': {
		...summaries[0],
		agreementId: 'AGR-1',
		baselineLineItems: [
			{ sku: 'SKU-A', description: 'Widget A', quantity: 10, unitPrice: 500 },
			{ sku: 'SKU-B', description: 'Widget B', quantity: 30, unitPrice: 100 },
		],
		proposedLineItems: [
			{ sku: 'SKU-A', description: 'Widget A', quantity: 11, unitPrice: 500 },
			{ sku: 'SKU-B', description: 'Widget B', quantity: 30, unitPrice: 100 },
		],
		baselineTotal: 8000,
		newTotal: 8500,
		audit: [
			{ action: 'SEND_FOR_APPROVAL', byUserId: 'alice', at: '2026-03-02T10:00:00.000Z' },
			{ action: 'SUBMIT', byUserId: 'alice', at: '2026-03-02T09:30:00.000Z' },
			{ action: 'CREATE', byUserId: 'alice', at: '2026-03-02T09:00:00.000Z' },
		],
	},
	'CR-2': {
		...summaries[1],
		agreementId: 'AGR-1',
		baselineLineItems: [{ sku: 'SKU-B', description: 'Widget B', quantity: 30, unitPrice: 100 }],
		proposedLineItems: [{ sku: 'SKU-B', description: 'Widget B (new supplier)', quantity: 30, unitPrice: 100 }],
		baselineTotal: 3000,
		newTotal: 3000,
		audit: [
			{ action: 'CREATE', byUserId: 'alice', at: '2026-02-28T09:00:00.000Z' },
			{ action: 'APPROVE', byUserId: 'mona', at: '2026-03-01T08:30:00.000Z' },
			{ action: 'APPLY', byUserId: 'amy', at: '2026-03-01T09:00:00.000Z' },
		],
	},
	'CR-3': {
		...summaries[2],
		agreementId: 'AGR-2',
		baselineLineItems: [{ sku: 'SKU-C', description: 'Service C', quantity: 1, unitPrice: 1000 }],
		proposedLineItems: [{ sku: 'SKU-C', description: 'Service C', quantity: 1, unitPrice: 1000 }],
		baselineTotal: 1000,
		newTotal: 1000,
		audit: [{ action: 'CREATE', byUserId: 'alice', at: '2026-03-03T11:00:00.000Z' }],
	},
	'CR-9': {
		...summaries[3],
		agreementId: 'AGR-9',
		baselineLineItems: [{ sku: 'SKU-Z', description: 'Z', quantity: 5, unitPrice: 200 }],
		proposedLineItems: [{ sku: 'SKU-Z', description: 'Z', quantity: 6, unitPrice: 200 }],
		baselineTotal: 1000,
		newTotal: 1200,
		audit: [{ action: 'CREATE', byUserId: 'bob', at: '2026-03-02T08:00:00.000Z' }],
	},
};
