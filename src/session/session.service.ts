import { Injectable } from '@angular/core';
import { ReqUser } from '../models/cr.models';
import { users } from '../api/fixtures';

/**
 * Holds the current signed-in user. Components read `user` to decide which actions to offer.
 * (In the real app this is populated from the auth token; here it defaults to a seeded user and
 * can be swapped in tests by overriding the provider or setting `.user`.)
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
	user: ReqUser = users.approver;
}
