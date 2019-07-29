import { VictimFilters } from './../types/victimFilters.d';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Victim } from '../types/victim';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VictimService {

  constructor(
    private http: HttpClient
  ) { }

  getVictims(filters: VictimFilters): Observable<Victim[]> {
    return (this.http.get('../../assets/data/victims.json') as Observable<Victim[]>).pipe(
      map(victims => {
        let allVictims = [...victims];

        victims = this.filterByContext(victims, filters.context || '');
        victims = this.filterByIds(victims, filters.excludeIds || []);

        let pickedVictims: Victim[] = [];

          // if there are enough victims filtered by context and ids, expand the victims by including the victims that were excluded
        if (victims.length >= filters.count){
          pickedVictims =  this.pickVictims(victims, filters.count);
        }
        else{
          pickedVictims = victims;
          let victimsExpandedByIds = this.filterByIds(this.filterByContext(allVictims, filters.context), this.getVictimsIds(pickedVictims));

          // if there are not enough victims filtered by context, expand the victims list by including victims with other contexts
          if (victimsExpandedByIds.length >= filters.count - pickedVictims.length){
            pickedVictims = pickedVictims.concat(this.pickVictims(victimsExpandedByIds, filters.count - victims.length));
          }
          else {

            // if there are not enough victims in total, return all of them
            if(allVictims.length >= filters.count){
              pickedVictims = victims.concat(this.pickVictims(allVictims, filters.count - victims.length));
            }
            else{
              pickedVictims = allVictims;
            }
          }
        }

        return pickedVictims;
      })
    );
  }


  getVictimsIds(victims: Victim[]): string[] {
    return victims.map(victim => victim._id);
  }

  filterByIds(victims: Victim[], excludeIds: string[]): Victim[]{
    return victims.filter(victim => !excludeIds.includes(victim._id));
  }

  filterByContext(victims: Victim[], context: string): Victim[]{
    let filteredVictims = victims.filter(victim => victim.context.includes(context.toLowerCase()) ? victim : false);
    if (filteredVictims.length)
      return filteredVictims;
    return victims;
  }

  pickVictims(victims: Victim[], count: number): Victim[]{
    let pickedVictims: Victim[] = [];

    for (let i = 0; i < count || 0; i++) {
      let rand = Math.floor((Math.random() * victims.length));
      pickedVictims.push(victims[rand]);
      victims.splice(rand, 1);
    }
    
    return pickedVictims;
  }

}
