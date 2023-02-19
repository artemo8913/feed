import { runSeeders } from 'typeorm-extension';

import { AppDataSource } from './data-source';

(async () => {
    await AppDataSource.initialize();

    await runSeeders(AppDataSource);
})();
