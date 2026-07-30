import type { IHomeRemoteDataSource, UserApplicationDoc } from '../datasources/home-remote-datasource';

export class HomeRepositoryImpl {
  constructor(private remoteDataSource: IHomeRemoteDataSource) {}

  observeUserApplications(
    uid: string,
    onSuccess: (apps: UserApplicationDoc[]) => void,
    onError: (err: Error) => void
  ): () => void {
    return this.remoteDataSource.subscribeUserApplications(uid, onSuccess, onError);
  }
}
