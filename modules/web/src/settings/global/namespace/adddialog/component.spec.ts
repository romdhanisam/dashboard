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

import {AddFallbackNamespaceDialog} from './dialog';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {Pipe, PipeTransform} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('AddFallbackNamespaceDialog', () => {
  let component: AddFallbackNamespaceDialog;
  let fixture: ComponentFixture<AddFallbackNamespaceDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatDialogModule, NoopAnimationsModule],
      declarations: [AddFallbackNamespaceDialog, FilterByMockPipe],
      providers: [{provide: MAT_DIALOG_DATA, useValue: {namespaces: ['test']}}],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFallbackNamespaceDialog);
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

@Pipe({name: 'kdFilterBy'})
class FilterByMockPipe implements PipeTransform {
  transform(arr: string[], _: string): string[] {
    return arr;
  }
}
