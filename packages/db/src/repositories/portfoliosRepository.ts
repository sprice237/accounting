import { PortfolioModel } from '$models';
import { BaseRepositoryWithDefaultActions } from './baseRepositoryWithDefaultActions';

export class PortfoliosRepository extends BaseRepositoryWithDefaultActions<PortfolioModel, 'id'> {
  get ModelClass(): typeof PortfolioModel {
    return PortfolioModel;
  }
}
