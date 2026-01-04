import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-collapsible-section',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './collapsible-section.component.html',
  styleUrls: ['./collapsible-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollapsibleSectionComponent {
  @Input() title: string = '';
  @Input() defaultOpen: boolean = true;

  isOpen: boolean = true;

  ngOnInit() {
    this.isOpen = this.defaultOpen;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
