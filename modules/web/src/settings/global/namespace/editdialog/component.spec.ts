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

import {EditFallbackNamespaceDialog} from './dialog';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

describe('EditFallbackNamespaceDialog', () => {
  let component: EditFallbackNamespaceDialog;
  let fixture: ComponentFixture<EditFallbackNamespaceDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatListModule, MatIconModule, MatDividerModule],
      declarations: [EditFallbackNamespaceDialog],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {namespaces: ['ns1', 'ns2', 'ns3']}}],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFallbackNamespaceDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove namespace', () => {
    // Given
    // When
    component.remove('ns2');
    // Then
    expect(component.namespaces).toEqual(['ns1', 'ns3']);
  });
});
