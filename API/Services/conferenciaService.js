// conferenceService.js
import { fetchApi } from '../utils/api.js';

export function findListConferencias() {
    return fetchApi('/conferencias', 'GET');
}


