import {Component} from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserState} from "../../models/userState";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
    selector: 'app-user-auth-panel',
    templateUrl: './user-auth-panel.component.html',
    styleUrls: ['./user-auth-panel.component.css']
})
export class UserAuthPanelComponent {

    constructor(private userService: UserService, private router: Router) {
        userService.getUserData().subscribe((userState) => {
            if (!!userState)
                this.router.navigate(['/home']);
        })
    }

    handleRegister(form: NgForm) {

        this.userService.registerUser(form.value.readEmail, form.value.readPassword, form.value.readName);
        form.resetForm();
    }

    handleLogin(form: NgForm) {
        this.userService.login(form.value.readEmail, form.value.readPassword);
        form.resetForm();
    }

    exampleUserAccess() {
        this.userService.login("gabriel@gabriel.gabriel", "gabriel@gabriel.gabriel")
    }


}
