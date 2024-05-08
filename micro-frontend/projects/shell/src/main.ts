import { loadManifest } from '@angular-architects/module-federation';

loadManifest('./assets/mf.manifest.json')
  .catch(err => console.log(err))
  .then(_ => import('./bootstrap')
    .catch(err => console.error(err)));
