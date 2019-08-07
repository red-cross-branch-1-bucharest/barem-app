import { switchMap, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { CaseService } from 'src/app/services/case.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Case } from 'src/app/types/case';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent implements OnInit {

  case$: Observable<Case>;

  constructor(
    private caseService: CaseService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.case$ = this.activatedRoute.params.pipe(
      switchMap(params => {
        return this.caseService.getCaseByCode(params.id);
      })
    );
  }
}
