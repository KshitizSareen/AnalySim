import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/interfaces/project';
import { AccountService } from 'src/app/services/account.service';
import { ApplicationUser } from 'src/app/interfaces/user';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-dashboard-quickstart',
  templateUrl: './dashboard-quickstart.component.html',
  styleUrls: ['./dashboard-quickstart.component.css']
})
export class DashboardQuickstartComponent implements OnInit {

  constructor(private accountService : AccountService,
    private projectService : ProjectService) { }

  userID : number
  currentUser : ApplicationUser
  projects : Project[] = null

  ngOnInit(): void {
    this.accountService.getUserByID(2).subscribe(
      result =>{
        this.currentUser = result
        console.log(result)
        this.loadProject(result)
      }, error =>{
        console.log(error)
      }
    )
  }

  loadProject(profile : ApplicationUser){
    let projectIDs : number[] = profile.projectUsers.map(pu => pu.projectID)
    
    this.projectService.getProjectRange(projectIDs).subscribe(
      result =>{
        // Map Project in Project User
        this.currentUser.projectUsers.map(pu => pu.project = result.find(p => p.projectID == pu.projectID))
        // Map Project
        this.projects = this.currentUser.projectUsers
          .filter(x => x.userRole != "follower")
          .map(x => x.project)
      }, error =>{
        console.log(error)
      }
    )
  }

}
