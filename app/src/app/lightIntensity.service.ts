import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class LightIntensityService {
  public subject = new Subject<any>();
  public event = this.subject.asObservable();

  public publish(data: any) {
    this.subject.next(data);
  }
}
