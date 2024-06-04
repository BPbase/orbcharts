import * as d3 from 'd3'
import { Observable, merge, distinctUntilChanged, fromEvent } from 'rxjs'

export function d3EventObservable(selection: d3.Selection<any, any, any, any>, event: any) {
  // Start with an observable that will never emit
  let obs = new Observable(() => {});
  selection.each(function () {
      // Create observables from each of the elements
      const events = fromEvent(this as any, event);
      // Merge the observables into one
      obs = merge(obs, events);
  });
  return obs;
}
