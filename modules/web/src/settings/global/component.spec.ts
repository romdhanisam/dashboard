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
// import { expect, it, describe } from '@jest/globals';

import {GlobalSettingsComponent} from './component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, UntypedFormBuilder} from '@angular/forms';
import {ResourceService} from '@common/services/resource/resource';
import {GlobalSettings, NamespaceList} from '@api/root.api';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {GlobalSettingsService} from '@common/services/global/globalsettings';
import {SettingsHelperService} from './service';
import {TitleService} from '@common/services/global/title';
import {HttpClientModule} from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Component, Input} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

describe('GlobalSettingsComponent', () => {
  let component: GlobalSettingsComponent;
  let fixture: ComponentFixture<GlobalSettingsComponent>;
  const resourceServiceMock: any = {get: jest.fn()};
  const globalSettingsServiceMock: any = {
    load: jest.fn(),
    canI: jest.fn(),
    isInitialized: jest.fn(),
    save: jest.fn(),
    getItemsPerPage: jest.fn(),
    getLabelsLimit: jest.fn(),
    getClusterName: jest.fn(),
    getLogsAutoRefreshTimeInterval: jest.fn(),
    getResourceAutoRefreshTimeInterval: jest.fn(),
    getDisableAccessDeniedNotifications: jest.fn(),
    getDefaultNamespace: jest.fn(),
    getNamespaceFallbackList: jest.fn(),
  };

  beforeEach(async () => {
    resourceServiceMock.get.mockReturnValue(of());
    globalSettingsServiceMock.load.mockReturnValue(of({}));
    globalSettingsServiceMock.canI.mockReturnValue(of(true));
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatSliderModule,
        MatSlideToggleModule,
        NoopAnimationsModule,
      ],
      declarations: [
        GlobalSettingsComponent,
        // mock others
        CardMockComponent,
        SettingsEntryMockComponent,
        NamespaceSettingsMockComponent,
      ],
      providers: [
        {provide: ResourceService<NamespaceList>, useValue: resourceServiceMock},
        {provide: GlobalSettingsService, useValue: globalSettingsServiceMock},
        {provide: SettingsHelperService},
        {provide: MatDialog},
        {provide: UntypedFormBuilder},
        {provide: TitleService},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update setting when save', () => {
    // Given
    globalSettingsServiceMock.save.mockReturnValue(of());
    const settings_: GlobalSettings = (component.settings = {
      clusterName: 'myCluster',
      defaultNamespace: 'default',
      disableAccessDeniedNotifications: false,
      itemsPerPage: 0,
      labelsLimit: 0,
      logsAutoRefreshTimeInterval: 0,
      namespaceFallbackList: [],
      resourceAutoRefreshTimeInterval: 0,
    });
    component.settings = settings_;
    // When
    component.save();
    // Then
    expect(globalSettingsServiceMock.save).toHaveBeenNthCalledWith(1, settings_);
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

@Component({
  selector: 'kd-namespace-settings',
  template: 'test',
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: NamespaceSettingsMockComponent, multi: true}],
})
class NamespaceSettingsMockComponent implements ControlValueAccessor {
  registerOnChange(_: any): void {}

  registerOnTouched(_: any): void {}

  writeValue(_: any): void {}
}
