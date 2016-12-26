import { observable, action } from 'mobx';
import * as axios from 'axios';

export interface ISettings {
  calculationTags: string[];
  dimensionTags: string[];
  elementTags: string[];
  languages: string[];
}

export class SettingsStore {
  @observable
  loading: boolean = false;

  @observable
  error: Error;

  @observable
  settings: ISettings;

  @action('load settings')
  load() {
    this.loading = true;

    return axios.get<ISettings>(BASE_URL + '/api/settings')
      .then(xhr => xhr.data)
      .then(action('fetch settings', (settings: ISettings) => {
        this.loading = false;
        this.settings = settings;
        return settings;
      }))
      .catch(action('fetch settings failed', (err: Error) => {
        this.loading = false;
        this.error = err;
        throw err;
      }));
  }
}
