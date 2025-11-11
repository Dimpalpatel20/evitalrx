import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { CartService } from '../../services/cart.service';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { AlternativeDialogboxComponent } from '../../alternative-dialogbox/alternative-dialogbox.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatRadioModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatExpansionModule,
    MatChipsModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatLabel,
  ],
  providers: [DecimalPipe, DatePipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  checkoutData: any = null;
  selectedCartOptionLabel: string = '';
  selectedCartOption: any = null;
  totalPayableAmount: number = 0;
  chargesSummary: any = null;
  estimatedDeliveryHuman: string = '';
  rxRequired: boolean = false;
  prescriptionUrlsInput: any;
  constructor(
    private cartS: CartService,
    private datePipe: DatePipe,
    private decPipe: DecimalPipe,
    private dialog: MatDialog,
    private _router: Router,
    private snackBar: MatSnackBar

  ) {}

  ngOnInit(): void {
    this.checkoutData = this.cartS.getCheckoutRes();
    console.log('Received CheckoutResponse :', this.checkoutData);
    if (!this.checkoutData) {
      this.checkoutData = {
        data: {},
        cart_options: [],
        items: [],
        charges: {},
      } as any;
    }
    this.rxRequired = (this.checkoutData.items || []).some(
      (item: any) => item.is_rx_required
    );
    console.log('rxRequired :', this.rxRequired);

    this.mergeAlternatives();
    if (
      Array.isArray(this.checkoutData.cart_options) &&
      this.checkoutData.cart_options.length
    ) {
      this.selectCartOption(this.checkoutData.cart_options[0].label);
    } else {
      this.chargesSummary = this.checkoutData.charges ?? {};
      this.totalPayableAmount =
        this.checkoutData.charges?.payable_amount?.without_discount ?? 0;
      this.estimatedDeliveryHuman = this.formatEstimated(
        this.checkoutData.items?.[0]?.estimated_delivery_tat
      );
    }
   
  }
  mergeAlternatives(): void {
    if (
      !this.checkoutData?.items?.length ||
      !this.checkoutData?.cart_options?.length
    )
      return;

    const topLevelItems = this.checkoutData.items;

    this.checkoutData.cart_options.forEach((option: any) => {
      option.items.forEach((cartItem: any) => {
        const originalItem = topLevelItems.find(
          (i: any) => i.medicine_id === cartItem.medicine_id
        );
        if (
          originalItem &&
          originalItem.alternatives &&
          originalItem.alternatives.length > 0
        ) {
          cartItem.alternatives = originalItem.alternatives.map((alt: any) => ({
            ...alt,
            requested_quantity: cartItem.requested_quantity,
          }));
        }
      });
    });

    console.log(
      ' Merged alternatives into cart options:',
      this.checkoutData.cart_options
    );
  }

  selectCartOption(label: string) {
    this.selectedCartOptionLabel = label;
    const option = (this.checkoutData.cart_options || []).find(
      (o: any) => o.label === label
    );
    if (!option) {
      this.selectedCartOption = null;
      return;
    }
    this.selectedCartOption = option;
    this.rxRequired = (option.items || []).some(
      (item: any) => item.is_rx_required
    );

    // If option gives payable_amount use that; otherwise compute sum of item.amount + shipping
    this.totalPayableAmount =
      option.payable_amount ?? this.computePayableFromOption(option);
    // charges from top-level as well (use checkoutData.charges for global view)
    this.chargesSummary = this.checkoutData.charges || {};
    // estimate delivery: pick earliest non-empty estimated_delivery_tat of items in this option
    const est = (option.items || [])
      .map((i: any) => i.estimated_delivery_tat)
      .find((x: any) => x);
    this.estimatedDeliveryHuman = this.formatEstimated(est);
  }

  computePayableFromOption(option: any) {
    const itemsTotal = (option.items || []).reduce((s: number, it: any) => {
      // use amount if provided else price*requested_quantity
      const amt =
        typeof it.amount === 'number' && it.amount > 0
          ? it.amount
          : (it.price ?? 0) * (it.requested_quantity ?? 1);
      return s + amt;
    }, 0);
    return Math.round((itemsTotal + (option.shipping ?? 0)) * 100) / 100;
  }

  // format "2025-07-28 18:13:52" to "18:13:52, 2025-07-28" or prettier human version
  formatEstimated(raw: string | undefined) {
    if (!raw) return '—';
    // expect "YYYY-MM-DD HH:mm:ss"
    const parts = raw.split(' ');
    if (parts.length === 2) {
      const date = parts[0];
      const time = parts[1];
      return `${time}, ${date}`;
    }
    const d = new Date(raw);
    2;
    if (isNaN(d.getTime())) return raw;
    return `${this.datePipe.transform(d, 'medium')}`;
  }

  // helper to format money consistently
  money(v: any) {
    if (v == null) return '0';
    return this.decPipe.transform(v, '1.2-2');
  }

  // Returns whether item is available
  isAvailable(item: any) {
    return item && item.available === 'yes';
  }
  // Function to open the dialog
  openAlternativesDialog(alternatives: any[]): void {
    this.dialog.open(AlternativeDialogboxComponent, {
      width: '500px', // Set a suitable width for the dialog
      data: {
        alternatives: alternatives, // Pass the array of alternatives to the dialog component
      },
    });
  }
  // Place order click (stub)
  placeOrder() {
    console.log(
      'Place order clicked. Selected option:',
      this.selectedCartOptionLabel,
      this.selectedCartOption
    );
    // alert('Place order clicked — see console for details.');
      this.snackBar.open('Place order clicked', 'Close', {
        duration: 6000,
        panelClass: ['snackbar-success']
      });
    const availableOrderItems = this.selectedCartOption.items.filter(
      (item: any) =>
        item.available !== 'no' && (item.requested_quantity ?? 0) > 0
    );

    const orderPayloadItems = availableOrderItems.map((item: any) => ({
      medicine_id: item.medicine_id,
      quantity: item.requested_quantity || 1, // Use requested_quantity as quantity
      discount_percentage: item.discount_percentage || 0, // Include discount_percentage
    }));
    this.cartS.setOrderPayloadItems(orderPayloadItems);
    console.log('orderPayloadItems :', orderPayloadItems);
    const finalPrescriptionUrls = this.prescriptionUrlsInput
      .split(',')
      .map((url: any) => url.trim())
      .filter((url: any) => url.length > 0);
    console.log('finalPrescriptionUrls ::', finalPrescriptionUrls);

    (this.cartS as any).setPrescriptionUrls(finalPrescriptionUrls);
    console.log('Prescription URLs stored:', finalPrescriptionUrls);

    this._router.navigate(['/dashboard/place-order']);
  }
}
