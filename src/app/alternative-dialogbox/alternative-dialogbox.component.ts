import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatChip } from "@angular/material/chips";
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
@Component({
  selector: 'app-alternative-dialogbox',
  standalone:true,
  imports: [CommonModule, MatChip, MatDialogContent],
  templateUrl: './alternative-dialogbox.component.html',
  styleUrl: './alternative-dialogbox.component.css'
})
export class AlternativeDialogboxComponent {
// Assume 'money' function is available or implemented here if needed for formatting
  // For simplicity, I'll assume you have access to the money function or it's provided via data
  money = (value: number) => value.toFixed(2); // Replace with your actual money formatting logic

  constructor(
    public dialogRef: MatDialogRef<AlternativeDialogboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { alternatives: any[] } // Type 'any[]' should be replaced with your actual item/alternative model
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
