import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonInput, IonSelect, IonSelectOption, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, ToastController, IonicModule } from
'@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
})


export class HomePage implements OnInit {
  listMahasiswa: any[] = [];

  // Variabel Form (UPDATE: Jurusan diganti jadi Prodi)
  inputNama = '';
  inputProdi = '';
  idEdit: number | null = null; // Penanda: Sedang mode Tambah atau Edit?

  constructor(
    private api: ApiService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.api.getMahasiswa().subscribe(res => this.listMahasiswa = res);
  }

  // --- LOGIKA FORM (CREATE & UPDATE) ---
  simpanData() {
    // Validasi: Pastikan Nama dan Prodi sudah diisi
    if (!this.inputNama || !this.inputProdi) return;
    // Kunci 'jurusan' dipertahankan karena struktur database MySQL tetap bernama 'jurusan'
    const data = { nama: this.inputNama, jurusan: this.inputProdi };
    if (this.idEdit) {
      // Jika mode EDIT (PUT)
      this.api.updateMahasiswa(this.idEdit, data).subscribe(() => {
        this.tampilkanToast('Data berhasil di-update!', 'success');
        this.resetForm();
        this.loadData();
      });
      } else {
        // Jika mode TAMBAH (POST)
        this.api.tambahMahasiswa(data).subscribe(() => {
        this.tampilkanToast('Data berhasil ditambahkan!', 'primary');
        this.resetForm();
        this.loadData();
      });
    }
  }

  // Isi form otomatis saat tombol edit ditekan
  editData(mhs: any) {
    this.idEdit = mhs.id;
    this.inputNama = mhs.nama;
    this.inputProdi = mhs.jurusan; // Ambil data lama dan masukkan ke Dropdown Select
  }

  resetForm() {
    this.idEdit = null;
    this.inputNama = '';
    this.inputProdi = ''; // Reset Dropdown Select
  }

  // --- LOGIKA HAPUS DENGAN KONFIRMASI (DELETE) ---
  async konfirmasiHapus(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Yakin ingin menghapus data ini?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus', role: 'confirm',
          handler: () => {
            this.api.deleteMahasiswa(id).subscribe(() => {
            this.tampilkanToast('Data berhasil dihapus', 'danger');
            this.loadData();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // --- UI FEEDBACK (TOAST) ---
  async tampilkanToast(pesan: string, warna: string) {
    const toast = await this.toastCtrl.create({
      message: pesan, duration: 2000, color: warna, position: 'bottom'
    });
    await toast.present();
  }
}
