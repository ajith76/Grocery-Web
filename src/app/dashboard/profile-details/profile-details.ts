import { Component, input, signal, output, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderUser } from '../header/header';

export interface AddressItem {
  id: string;
  data: string;
}

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-details.html',
  styleUrl: './profile-details.scss',
})
export class ProfileDetails implements OnInit {
  user = input.required<HeaderUser>();
  close = output<void>();

  // ── Personal Info ──
  name = signal('');
  email = signal('ajith.r@example.com');
  phone = signal('+91 98765 43210');
  age = signal<number | null>(24);
  gender = signal('Male');

  // ── Address State ──
  addresses = signal<AddressItem[]>([
    { id: '1', data: '123 Green Street, Tech Park, Bangalore' },
    { id: '2', data: '45/B West Field, Silicon Valley' }
  ]);
  
  newAddressInput = signal('');
  editingId = signal<string | null>(null);
  editInput = signal('');

  // ── Modal State ──
  isAddModalOpen = signal(false);
  area = signal('');
  street = signal('');
  city = signal('');
  state = signal('');
  pincode = signal('');


  // ── Constants & Computeds ──
  readonly MAX_ADDRESSES = 12;
  
  addressLimitReached = computed(() => this.addresses().length >= this.MAX_ADDRESSES);

  ngOnInit() {
    this.name.set(this.user().name);
  }


  // ── Address Methods ──
  openAddModal() {
    if (!this.addressLimitReached()) {
      this.isAddModalOpen.set(true);
    }
  }

  closeAddModal() {
    this.isAddModalOpen.set(false);
    this.editingId.set(null);
    this.resetAddressForm();
  }

  resetAddressForm() {
    this.area.set('');
    this.street.set('');
    this.city.set('');
    this.state.set('');
    this.pincode.set('');
  }

  saveAddress() {
    const a = this.area().trim();
    const s = this.street().trim();
    const c = this.city().trim();
    const st = this.state().trim();
    const p = this.pincode().trim();

    if (a && s && c && st && p) {
      const formatted = `${a}, ${s}, ${c}, ${st} - ${p}`;
      const eId = this.editingId();

      if (eId) {
        // Update existing
        this.addresses.update(list => list.map(item => item.id === eId ? { ...item, data: formatted } : item));
      } else if (!this.addressLimitReached()) {
        // Add new
        const newAddr: AddressItem = {
          id: Date.now().toString(),
          data: formatted
        };
        this.addresses.update(list => [...list, newAddr]);
      }
      this.closeAddModal();
    }
  }



  deleteAddress(id: string) {
    this.addresses.update(list => list.filter(a => a.id !== id));
  }

  startEdit(item: AddressItem) {
    this.editingId.set(item.id);
    
    // Parse the data back into fields: "Area, Street, City, State - Pincode"
    const parts = item.data.split(', ');
    if (parts.length >= 4) {
      this.area.set(parts[0]);
      this.street.set(parts[1]);
      this.city.set(parts[2]);
      
      const lastPart = parts[3].split(' - ');
      this.state.set(lastPart[0]);
      this.pincode.set(lastPart[1] || '');
    } else {
      // Fallback if format is different
      this.area.set(item.data);
    }
    
    this.isAddModalOpen.set(true);
  }

  saveEdit() {
    this.saveAddress();
  }


  cancelEdit() {
    this.editingId.set(null);
    this.editInput.set('');
  }

  onSaveProfile() {
    console.log('Profile Saved:', {
      name: this.name(),
      email: this.email(),
      phone: this.phone(),
      age: this.age(),
      gender: this.gender(),
      addresses: this.addresses()
    });
    this.close.emit();
  }
}
