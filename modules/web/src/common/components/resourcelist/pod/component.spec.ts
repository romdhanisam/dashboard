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

import {PodListComponent} from './component';
import {MatDialogModule} from '@angular/material/dialog';
import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Event, Metric, Pod, PodList} from '@api/root.api';
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
import {Status} from '@common/components/resourcelist/statuses';

describe('PodListComponent', () => {
  let component: PodListComponent;
  let fixture: ComponentFixture<PodListComponent>;
  const namespacedResourceServiceStub: any = {
    get: jest.fn(),
    pods: jest.fn(),
  };
  let pod1: Pod = {
    containerImages: ['nginx'],
    metrics: undefined,
    nodeName: 'worker1',
    objectMeta: undefined,
    restartCount: 0,
    serviceAccountName: '',
    status: Status.Running,
    typeMeta: undefined,
    warnings: [],
  };
  const podList: PodList = {
    cumulativeMetrics: [],
    listMeta: undefined,
    pods: [pod1],
    status: {running: 1, failed: 0, pending: 0, succeeded: 1},
  };
  beforeEach(async () => {
    namespacedResourceServiceStub.get.mockReturnValue(of(podList));
    namespacedResourceServiceStub.pods.mockReturnValue(podList.pods);
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
        PodListComponent,
        // stub others
        CardStubComponent,
        GraphMetricsStubComponent,
        CardListFilterStubComponent,
        ListZeroStateStubComponent,
        LoadingStubSpinner,
      ],
      providers: [
        {provide: NamespacedResourceService<PodList>, useValue: namespacedResourceServiceStub},
        {provide: NotificationsService, useValue: {}},
        {provide: ChangeDetectorRef, useValue: {}},
        {provide: CONFIG_DI_TOKEN, useValue: {}},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PodListComponent);
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
    const expectedURI: string = 'api/v1/pod/:namespace';
    const httpRequestParams: HttpParams = namespacedResourceServiceStub.get.mock.calls[0][3];
    expect(component.endpoint).toEqual(expectedURI);
    expect(namespacedResourceServiceStub.get).toHaveBeenCalledTimes(1);
    expect(httpRequestParams.get('page')).toEqual('1');
    expect(httpRequestParams.get('itemsPerPage')).toEqual('10');
    expect(httpRequestParams.get('sortBy')).toEqual('d,creationTimestamp');
  });

  it('isInErrorState should return false', () => {
    // Given When
    const isInError: boolean = component.isInErrorState(pod1);
    // Then
    expect(isInError).toEqual(false);
  });

  it('isInErrorState should return true', () => {
    // Given
    pod1 = {...pod1, status: Status.NotReady};
    // When
    const isInError: boolean = component.isInErrorState(pod1);
    // Then
    expect(isInError).toEqual(false);
  });

  it('hasError should return false', () => {
    // Given
    pod1 = {...pod1, warnings: []};
    // When
    const hasError: boolean = component.hasErrors(pod1);
    // Then
    expect(hasError).toEqual(false);
  });

  it('hasError should return true', () => {
    // Given
    pod1 = {...pod1, warnings: [{} as Event]};
    // When
    const hasError: boolean = component.hasErrors(pod1);
    // Then
    expect(hasError).toEqual(true);
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
@Component({selector: 'kd-graph-metrics', template: 'test'})
class GraphMetricsStubComponent {
  @Input() metrics: Metric[];
}
@Component({selector: 'kd-card-list-filter', template: 'test'})
class CardListFilterStubComponent {}

@Component({selector: 'kd-list-zero-state', template: 'test'})
class ListZeroStateStubComponent {}

@Component({selector: '[kdLoadingSpinner]', template: 'test'})
class LoadingStubSpinner {
  @Input() isLoading: boolean;
}
