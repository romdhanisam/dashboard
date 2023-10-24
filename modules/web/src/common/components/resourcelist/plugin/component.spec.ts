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

import {PluginListComponent} from './component';
import {MatDialogModule} from '@angular/material/dialog';
import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {PluginList} from '@api/root.api';
import {NamespacedResourceService} from '@common/services/resource/resource';
import {NotificationsService} from '@common/services/global/notifications';
import {MatTableModule} from '@angular/material/table';
import {of} from 'rxjs';
import {GlobalServicesModule} from '@common/services/global/module';
import {HttpClientModule, HttpParams} from '@angular/common/http';
import {CONFIG_DI_TOKEN} from '../../../../index.config';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {RouterTestingModule} from '@angular/router/testing';

describe('PluginListComponent', () => {
  let component: PluginListComponent;
  let fixture: ComponentFixture<PluginListComponent>;
  const namespacedResourceServiceStub: any = {
    get: jest.fn(),
  };
  const pluginList: PluginList = {
    listMeta: undefined,
  };
  beforeEach(async () => {
    namespacedResourceServiceStub.get.mockReturnValue(of(pluginList));
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatDialogModule,
        GlobalServicesModule,
        NoopAnimationsModule,
      ],
      declarations: [
        PluginListComponent,
        // stub others
        CardStubComponent,
        CardListFilterStubComponent,
        ListZeroStateStubComponent,
        LoadingStubSpinner,
      ],
      providers: [
        {provide: NamespacedResourceService<PluginList>, useValue: namespacedResourceServiceStub},
        {provide: NotificationsService, useValue: {}},
        {provide: ChangeDetectorRef, useValue: {}},
        {provide: CONFIG_DI_TOKEN, useValue: {}},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create endpoint', () => {
    const expectedURI: string = 'api/v1/plugin/:namespace';
    const httpRequestParams: HttpParams = namespacedResourceServiceStub.get.mock.calls[0][3];
    expect(component.endpoint).toEqual(expectedURI);
    expect(namespacedResourceServiceStub.get).toHaveBeenCalledTimes(1);
    expect(httpRequestParams.get('page')).toEqual('1');
    expect(httpRequestParams.get('itemsPerPage')).toEqual('10');
    expect(httpRequestParams.get('sortBy')).toEqual('d,creationTimestamp');
  });
});

@Component({selector: 'kd-card', template: 'test'})
class CardStubComponent {
  @Input() initialized = true;
  @Input() role: 'inner' | 'table' | 'inner-content';
  @Input() withFooter = false;
  @Input() withTitle = true;
  @Input() expandable = true;
  @Input() expanded = true;
  @Input() graphMode = false;
}
@Component({selector: 'kd-card-list-filter', template: 'test'})
class CardListFilterStubComponent {}

@Component({selector: 'kd-list-zero-state', template: 'test'})
class ListZeroStateStubComponent {}

@Component({selector: '[kdLoadingSpinner]', template: 'test'})
class LoadingStubSpinner {
  @Input() isLoading: boolean;
}
