// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {ComponentFixture, TestBed} from '@angular/core/testing';
// import {expect, it, describe} from '@jest/globals';

import {LocalSettingsComponent} from './component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Component, Input} from '@angular/core';
import {LocalSettingsService} from '@common/services/global/localsettings';
import {ThemeService} from '@common/services/global/theme';
import {CookieService} from 'ngx-cookie-service';
import {CONFIG_DI_TOKEN} from '../../index.config';
import {IConfig} from '@api/root.ui';
import {MatSelectModule} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('LocalSettingsComponent', () => {
  let component: LocalSettingsComponent;
  let fixture: ComponentFixture<LocalSettingsComponent>;
  const localSettingsServiceMock: any = {get: jest.fn(), handleThemeChange: jest.fn()};
  const cookieServiceMock: any = {get: jest.fn()};
  const themeServiceMock: any = {theme: '', themes: []};
  const appConfigMock: IConfig = {
    authModeCookieName: '',
    authTokenCookieName: '',
    authTokenHeaderName: '',
    csrfHeaderName: '',
    defaultLanguage: '',
    defaultNamespace: '',
    languageCookieName: '',
    skipLoginPageCookieName: '',
    supportedLanguages: [],
    usernameCookieName: '',
  };

  beforeEach(async () => {
    cookieServiceMock.get.mockReturnValue({});
    localSettingsServiceMock.get.mockReturnValue({theme: 'kd-theme'});
    await TestBed.configureTestingModule({
      imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [
        LocalSettingsComponent,
        // mock others
        CardMockComponent,
        SettingsEntryMockComponent,
      ],
      providers: [
        {provide: LocalSettingsService, useValue: localSettingsServiceMock},
        {provide: ThemeService, useValue: themeServiceMock},
        {provide: CookieService, useValue: cookieServiceMock},
        {provide: CONFIG_DI_TOKEN, useValue: appConfigMock},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({selector: 'kd-card', template: 'test'})
class CardMockComponent {
  @Input() initialized = true;
  @Input() role: 'inner' | 'table' | 'inner-content';
  @Input() withFooter = false;
  @Input() withTitle = true;
  @Input() expandable = true;
  @Input() expanded = true;
  @Input() graphMode = false;
}
@Component({selector: 'kd-settings-entry', template: 'test'})
class SettingsEntryMockComponent {
  @Input() key: string;
  @Input() desc: string;
}
