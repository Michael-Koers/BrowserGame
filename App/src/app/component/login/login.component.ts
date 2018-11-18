import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    @Output() login = new EventEmitter<User>();

    private form: FormGroup;

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.form = this.fb.group({
            nickname: ['', [Validators.required]]
        })
    }

    submit(event: Event) {
        this.login.emit(this.form.value);
    }


}
