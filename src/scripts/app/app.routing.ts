import { RouterModule, Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard.component';
import { DoodleEditor } from './doodle-editor/doodle-editor.component';

const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'doodle/:id', component: DoodleEditor}
];

export const routing = RouterModule.forRoot(routes);
