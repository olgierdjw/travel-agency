import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserState} from "../../models/userState";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  userList: UserState[] | null = null;
  constructor(private userService: UserService) {
    userService.getAllUsers().subscribe((usersList)=> {
      this.userList = usersList;
      if (!usersList)
        userService.requestUserList();
      console.log(usersList)
    });
  }

  ngOnInit(): void {
  }

  toggleUserBan(user: UserState){
    this.userService.toggleUserBan(user);
  }
  toggleUserPermission(user: UserState, permissionId: number){
    this.userService.toggleUserPermission(user, permissionId);
  }


}
