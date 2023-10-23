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

import {ShellComponent} from './component';
import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {NamespacedResourceService} from '@common/services/resource/resource';
import {PodContainerList, TerminalResponse} from '@api/root.api';
import {UtilityService} from '@common/services/resource/utility';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {of} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;
  const namespacedResourceServiceMock: any = {get: jest.fn()};
  const utilityServiceMock: any = {shell: jest.fn()};
  const paramMap: ParamMap = {
    keys: [],
    get(_: string): string | null {
      return 'nginx1';
    },
    getAll(_: string): string[] {
      return ['nginx1', 'nginx2'];
    },
    has(_: string): boolean {
      return false;
    },
  };

  beforeEach(async () => {
    const podContainerList: PodContainerList = {containers: ['nginx1']};
    namespacedResourceServiceMock.get.mockReturnValue(of(podContainerList));
    utilityServiceMock.shell.mockReturnValue(of({}));
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule, MatSelectModule],
      declarations: [ShellComponent, CardMockComponent],
      providers: [
        {provide: NamespacedResourceService<PodContainerList>, useValue: namespacedResourceServiceMock},
        {provide: UtilityService<TerminalResponse>, useValue: utilityServiceMock},
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(paramMap),
            snapshot: {
              params: {
                resourceName: 'pod',
                resourceNamespace: 'default',
              },
            },
          },
        },
        {provide: Router},
        {provide: MatSnackBar},
        {provide: ChangeDetectorRef},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initTerm', () => {
    // Given
    // When
    component.ngAfterViewInit();
    // Then
    expect(component.selectedContainer).toEqual('nginx1');
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
