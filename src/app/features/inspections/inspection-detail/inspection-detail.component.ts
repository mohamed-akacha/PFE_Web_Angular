import {Component, Pipe} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Inspection} from "../../../core/models/Inspection";
import {InspectionsService} from "../../../core/services/inspections.service";
import {EvaluationService} from "../../../core/services/evaluation.service";
import {Evaluation} from "../../../core/models/Evaluation";
import { Observable } from 'rxjs';




declare var $: any;
@Component({
  selector: 'app-inspection-detail',
  templateUrl: './inspection-detail.component.html',
  styleUrls: ['./inspection-detail.component.scss']
})

export class InspectionDetailComponent {
  activeTab: string = '';
  inspectionId:number=0;
  inspection!: Inspection;
  evaluations: Evaluation[]=[];
  groupedEvaluations: { [key: string]: Evaluation[] }= {};
  selectedImage: any;
  isModalOpen: boolean = false


  constructor(private route: ActivatedRoute,private inspecService:InspectionsService,private evalService:EvaluationService) { }

  objectKeys(obj:any) {
    return Object.keys(obj);
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.inspectionId = params['id'];
    });

    this.inspecService.getInspectionById(this.inspectionId).subscribe(data => {
      this.inspection = data;

      this.evalService.getEvaluationByInspecId(data.id).subscribe(data1 => {
        this.evaluations = data1;
        this.groupedEvaluations = {};

        // Group evaluations by blocId
        for (const evaluation of this.evaluations) {
          const blocId = evaluation.blocId;
          if (this.groupedEvaluations.hasOwnProperty(blocId)) {
            this.groupedEvaluations[blocId].push(evaluation);
          } else {
            this.groupedEvaluations[blocId] = [evaluation];
          }
        }

        // Set the active tab to the first key
        this.activeTab = Object.keys(this.groupedEvaluations)[0];

      });
    });
  }
  openModal(image: any) {
    this.selectedImage = image;
    this.isModalOpen = true;
  }

  closeModal() {
    this.selectedImage = '';
    this.isModalOpen = false;
  }

  changeTab(tabName: string) {
    this.activeTab = tabName;
  }
}
