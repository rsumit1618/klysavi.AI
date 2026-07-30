import type {
  ICardApplicationRemoteDataSource,
  CardApplicationPayload,
} from '../datasources/card-application-remote-datasource';

export class CardApplicationRepositoryImpl {
  constructor(private remoteDataSource: ICardApplicationRemoteDataSource) {}

  async apply(payload: CardApplicationPayload): Promise<string> {
    return this.remoteDataSource.submitApplication(payload);
  }
}
