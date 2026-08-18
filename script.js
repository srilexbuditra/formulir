const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0
}).format(n);

function calc() {
  const s = $('input[name="service"]:checked');
  const base = Number(s.dataset.price);
  const a = $$('.addon:checked');
  const extra = a.reduce((x, e) => x + Number(e.dataset.price), 0);
  const total = base + extra;

  $('#base').textContent = money(base);
  $('#addons').textContent = money(extra);
  $('#grand').textContent = money(total);
  $('#total').textContent = money(total);
  $('#selected').textContent = s.value;
  return { s, a, total };
}

$$('input[name="service"], .addon').forEach(e => e.addEventListener('change', calc));
calc();

function data() {
  const c = calc();
  return {
    name: $('#name').value.trim(),
    company: $('#company').value.trim(),
    phone: $('#phone').value.trim(),
    email: $('#email').value.trim(),
    deadline: $('#deadline').value,
    priority: $('#priority').value,
    notes: $('#notes').value.trim(),
    service: c.s.value,
    addons: c.a.map(x => x.value),
    total: c.total
  };
}

$('#priceForm').addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.reportValidity()) {
    $('#total').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

$('#wa').onclick = () => {
  if (!$('#priceForm').reportValidity()) return;
  const d = data();
  const add = d.addons.length ? d.addons.map(x => '• ' + x).join('\n') : '• Tidak ada';
  const msg = `Halo Srilex Buditra, saya ingin meminta penawaran jasa.\n\nNama: ${d.name}\nBisnis/Perusahaan: ${d.company || '-'}\nWhatsApp: ${d.phone}\nEmail: ${d.email || '-'}\n\nLayanan: ${d.service}\nFitur tambahan:\n${add}\n\nTarget waktu: ${d.deadline}\nPrioritas: ${d.priority}\nEstimasi harga: ${money(d.total)}\n\nKebutuhan proyek:\n${d.notes || '-'}`;
  window.open('https://wa.me/6282136238350?text=' + encodeURIComponent(msg), '_blank');
};

// Cetak / Simpan PDF — tidak memerlukan semua field wajib terisi.
// Di HP: tombol ini membuka dialog cetak browser, lalu pilih "Simpan sebagai PDF".
$('#print').onclick = () => {
  calc();
  const btn = $('#print');
  btn.disabled = true;
  btn.textContent = 'Menyiapkan PDF…';

  // Beri waktu browser memperbarui tampilan sebelum membuka print dialog.
  setTimeout(() => {
    try {
      window.print();
    } finally {
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Cetak / Simpan PDF';
      }, 500);
    }
  }, 100);
};
