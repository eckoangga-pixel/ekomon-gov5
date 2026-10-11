import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const $=id=>document.getElementById(id);
const screens=["home","setup","game"];
let renderer,scene,camera,clock,hero,animationFrame;
let enemies=[],bolts=[],particles=[],trees=[];
let running=false,paused=false,soundOn=true;
let lives=3,score=0,questionIndex=0,kills=0,wave=1;
let grade=1,subject="mat",difficulty="mudah",mode="solo";
let questions=[],awaitingAnswer=false,enemyTimer=0,worldTime=0,invuln=0;
let targetX=0,targetY=.9,lastShot=0,pointer=null,audioCtx=null;

const bank={
pai:[["Sebelum makan, kita dianjurkan…",["Berdoa","Berlari","Berteriak","Tidur"],0],["Kitab suci umat Islam adalah…",["Al-Qur'an","Weda","Tripitaka","Taurat"],0],["Salat wajib dalam sehari semalam berjumlah…",["3","4","5","6"],2],["Sikap kepada orang tua yang baik adalah…",["Membentak","Menghormati","Mengabaikan","Mengejek"],1],["Ucapan salam umat Islam adalah…",["Halo","Assalamu'alaikum","Selamat jalan","Permisi"],1],["Saat teman kesulitan, kita sebaiknya…",["Membantu","Menertawakan","Meninggalkan","Menyalahkan"],0],["Puasa Ramadan melatih kita untuk…",["Boros","Sabar","Marah","Malas"],1],["Tempat ibadah umat Islam disebut…",["Masjid","Pura","Vihara","Gereja"],0],["Berkata sesuai kenyataan disebut…",["Jujur","Sombong","Dengki","Curang"],0],["Menjaga kebersihan adalah perilaku…",["Terpuji","Buruk","Sia-sia","Terlarang"],0]],
mat:[["7 + 5 = …",["10","11","12","13"],2],["15 − 8 = …",["6","7","8","9"],1],["4 × 3 = …",["7","12","14","16"],1],["20 ÷ 5 = …",["2","3","4","5"],2],["Setengah dari 18 adalah…",["8","9","10","12"],1],["Bangun dengan 3 sisi disebut…",["Persegi","Lingkaran","Segitiga","Trapesium"],2],["1 jam sama dengan… menit",["30","45","60","100"],2],["Keliling persegi sisi 4 cm adalah…",["8 cm","12 cm","16 cm","20 cm"],2],["Pecahan senilai dengan 1/2 adalah…",["1/3","2/4","3/5","2/3"],1],["9 × 6 = …",["45","54","56","63"],1]],
indo:[["Lawan kata “besar” adalah…",["Tinggi","Kecil","Lebar","Panjang"],1],["Kalimat tanya diakhiri tanda…",["Titik","Koma","Tanya (?)","Seru"],2],["Kata baku yang benar adalah…",["Apotik","Apotek","Apotick","Apoték"],1],["Sinonim “gembira” adalah…",["Sedih","Marah","Senang","Takut"],2],["Kata kerja pada “Rani membaca buku” adalah…",["Rani","Membaca","Buku","Pada"],1],["Huruf pertama nama orang ditulis…",["Kecil","Kapital","Miring","Tebal"],1],["Cerita dengan tokoh hewan disebut…",["Fabel","Puisi","Pantun","Berita"],0],["“Tolong tutup pintu!” termasuk kalimat…",["Perintah","Tanya","Berita","Deskripsi"],0],["Kata dasar “bermain” adalah…",["Main","Bermain","Ber","Mem"],0],["Gagasan utama paragraf disebut…",["Ide pokok","Tanda baca","Sampul","Dialog"],0]],
pancasila:[["Lambang negara Indonesia adalah…",["Garuda Pancasila","Harimau","Merpati","Komodo"],0],["Sila pertama berbunyi…",["Persatuan Indonesia","Ketuhanan Yang Maha Esa","Keadilan sosial","Kemanusiaan"],1],["Saat musyawarah kita harus…",["Memaksakan kehendak","Mendengarkan pendapat","Bertengkar","Pergi"],1],["Bendera Indonesia berwarna…",["Biru putih","Merah putih","Hijau kuning","Merah biru"],1],["Contoh gotong royong adalah…",["Membersihkan kelas bersama","Mengejek teman","Membuang sampah","Bermain sendiri"],0],["Aturan dibuat agar hidup menjadi…",["Kacau","Tertib","Sulit","Sepi"],1],["Menghargai teman berbeda agama merupakan…",["Toleransi","Iri","Egois","Curang"],0],["Sila ketiga mengajarkan…",["Persatuan","Perpecahan","Persaingan","Kekayaan"],0],["Jika berbuat salah, sebaiknya…",["Menyalahkan teman","Meminta maaf","Kabur","Diam"],1],["Hak harus diimbangi dengan…",["Hadiah","Kewajiban","Permainan","Keinginan"],1]],
ipas:[["Tumbuhan membuat makanan terutama di…",["Akar","Daun","Bunga","Buah"],1],["Sumber energi utama Bumi adalah…",["Bulan","Matahari","Angin","Batu"],1],["Hewan pemakan tumbuhan disebut…",["Karnivor","Herbivor","Omnivor","Predator"],1],["Air yang dipanaskan lama-lama…",["Membeku","Menguap","Menjadi batu","Hilang"],1],["Organ utama pernapasan manusia adalah…",["Paru-paru","Lambung","Tulang","Kulit"],0],["Matahari terbit dari arah…",["Barat","Utara","Timur","Selatan"],2],["Daun kering termasuk sampah…",["Organik","Logam","Kaca","Elektronik"],0],["Benda jatuh karena gaya…",["Magnet","Gravitasi","Gesek","Listrik"],1],["Bagian tumbuhan menyerap air adalah…",["Bunga","Akar","Buah","Daun"],1],["Es menjadi air merupakan perubahan…",["Membeku","Mencair","Menguap","Mengembun"],1]],
jawa:[["“Matur nuwun” tegese…",["Permisi","Terima kasih","Selamat pagi","Maaf"],1],["“Sugeng enjing” digunakake nalika…",["Esuk","Bengi","Tengah wengi","Sore"],0],["Basa krama kanggo “aku” yaiku…",["Kowe","Kula","Dheweke","Kita"],1],["“Monggo” tegese…",["Silakan","Tidak","Pergi","Cepat"],0],["Kosok balen saka “gedhe” yaiku…",["Dawa","Cilik","Dhuwur","Akeh"],1],["“Bapak tindak kantor” nggunakake basa…",["Ngoko","Krama alus","Gaul","Inggris"],1],["Dina sawise Senin yaiku…",["Minggu","Selasa","Jumat","Sabtu"],1],["“Piye kabare?” tegese…",["Siapa namamu?","Apa kabar?","Mau ke mana?","Terima kasih"],1],["“Banyu” ing basa Indonesia yaiku…",["Api","Air","Tanah","Angin"],1],["Yen ketemu guru, kita kudu…",["Ngguyu","Ngurmati","Mlayu","Ngganggu"],1]],
inggris:[["“Cat” artinya…",["Anjing","Kucing","Burung","Ikan"],1],["Good morning diucapkan pada…",["Pagi","Malam","Tengah malam","Sore"],0],["“Green” adalah warna…",["Merah","Hijau","Biru","Putih"],1],["“Eight” berarti…",["Enam","Tujuh","Delapan","Sembilan"],2],["“Thank you” berarti…",["Maaf","Tolong","Terima kasih","Sampai jumpa"],2],["Jamak dari “book” adalah…",["Bookes","Books","Bookies","Book"],1],["“I am happy” berarti…",["Saya lapar","Saya senang","Saya sedih","Saya tidur"],1],["Lawan kata “hot” adalah…",["Warm","Cold","Tall","Fast"],1],["“Apple” adalah…",["Buah","Hewan","Warna","Kendaraan"],0],["“How are you?” menanyakan…",["Nama","Kabar","Alamat","Makanan"],1]],
pjok:[["Sebelum olahraga kita melakukan…",["Pemanasan","Tidur","Makan banyak","Duduk"],0],["Agar tubuh sehat kita perlu…",["Bergerak dan berolahraga","Begadang","Jarang minum","Malas"],0],["Setelah olahraga sebaiknya minum…",["Air putih","Minyak","Air sabun","Tidak perlu"],0],["Sepak bola terutama menggunakan…",["Kaki","Raket","Tongkat","Sarung tangan"],0],["Mencuci tangan membantu mencegah…",["Penyakit","Olahraga","Tidur","Lapar"],0],["Gerak berpindah tempat disebut…",["Lokomotor","Diam","Istirahat","Melingkar"],0],["Saat bermain kita harus menaati…",["Aturan","Keinginan sendiri","Teman terkuat","Tidak ada"],0],["Istirahat cukup membantu tubuh…",["Pulih","Sakit","Haus","Lelah terus"],0],["Contoh latihan daya tahan adalah…",["Jalan cepat","Tidur","Membaca","Duduk"],0],["Teman jatuh saat bermain, kita…",["Menolong","Menertawakan","Meninggalkan","Mendorong"],0]],
coding:[["Urutan langkah menyelesaikan tugas disebut…",["Algoritma","Gambar","Warna","Suara"],0],["Perintah kepada karakter disebut…",["Instruksi","Tebakan","Hiasan","Makanan"],0],["Mengulang langkah beberapa kali memakai…",["Perulangan","Penghapus","Judul","Warna"],0],["Memecah masalah besar menjadi bagian kecil disebut…",["Dekomposisi","Duplikasi","Dekorasi","Animasi"],0],["“Jika… maka…” adalah…",["Percabangan","Perulangan","Gambar","Suara"],0],["Data yang dimasukkan program disebut…",["Input","Output","Error","Warna"],0],["Hasil keluaran program disebut…",["Input","Output","Kode","Papan"],1],["Bug adalah…",["Kesalahan program","Hadiah","Karakter","Kecepatan"],0],["Algoritma sebaiknya…",["Jelas dan logis","Acak","Rahasia","Tidak lengkap"],0],["Kata sandi yang baik sebaiknya…",["Dibagikan","Dirahasiakan","Ditulis umum","Selalu 123"],1]],
seni:[["Warna primer yang umum dipelajari…",["Merah, kuning, biru","Hijau, jingga, ungu","Hitam, putih, abu","Cokelat, emas, merah muda"],0],["Alat mewarnai gambar adalah…",["Krayon","Sendok","Piring","Gelas"],0],["Garis berbelok-belok disebut…",["Lurus","Zigzag","Datar","Titik"],1],["Seni melipat kertas disebut…",["Origami","Senam","Drama","Musik"],0],["Merah dicampur kuning menjadi…",["Hijau","Jingga","Ungu","Biru"],1],["Menempel potongan bahan pada bidang disebut…",["Kolase","Senam","Drama","Musik"],0],["Bentuk bola termasuk bentuk…",["Datar","Ruang","Garis","Titik"],1],["Saat membuat karya seni kita perlu…",["Kreatif dan hati-hati","Merusak alat","Meniru saja","Membuang bahan"],0],["Alat membuat garis lurus adalah…",["Penggaris","Kain","Gelas","Kuas besar"],0],["Susunan unsur rupa agar seimbang disebut…",["Komposisi","Cuaca","Lagu","Gerak"],0]]
};

const subjectName={pai:"Pendidikan Agama Islam",mat:"Matematika",indo:"Bahasa Indonesia",pancasila:"Pendidikan Pancasila",ipas:"IPAS",jawa:"Bahasa Jawa",inggris:"Bahasa Inggris",pjok:"PJOK",coding:"Koding",seni:"Seni Rupa"};

function show(id){screens.forEach(s=>$(s).classList.toggle("hidden",s!==id))}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function makeQuestions(){
  let source=shuffle(bank[subject]).slice(0,10);
  // For upper grades, generate a little more numerical variation in the math starter bank.
  if(subject==="mat" && grade>=4){
    source=source.map(q=>{
      if(Math.random()<.55){
        const a=grade*4+Math.floor(Math.random()*10), b=grade+2+Math.floor(Math.random()*5), ans=a+b;
        const opts=shuffle([String(ans),String(ans+2),String(ans-2),String(ans+5)]);
        return [`${a} + ${b} = …`,opts,opts.indexOf(String(ans))];
      }
      return q;
    });
  }
  return source.map(q=>({text:q[0],options:q[1],correct:q[2]}));
}
function chooseButtons(group){
  document.querySelectorAll(`#${group} .choice`).forEach(b=>b.onclick=()=>{document.querySelectorAll(`#${group} .choice`).forEach(x=>x.classList.remove("active"));b.classList.add("active")});
}
chooseButtons("difficulty");chooseButtons("mode");

function beep(type){
  if(!soundOn)return;
  try{
    audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==="suspended")audioCtx.resume();
    const o=audioCtx.createOscillator(),g=audioCtx.createGain(),n=audioCtx.currentTime;
    const presets={shoot:[650,1250,.13,"sawtooth"],jump:[260,720,.18,"sine"],hit:[150,60,.25,"square"],correct:[520,900,.25,"sine"],wrong:[260,170,.25,"triangle"],win:[420,880,.55,"sine"],menu:[330,520,.4,"triangle"]};
    const p=presets[type]||presets.menu;o.type=p[3];o.frequency.setValueAtTime(p[0],n);o.frequency.exponentialRampToValueAtTime(p[1],n+p[2]);g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(.13,n+.02);g.gain.exponentialRampToValueAtTime(.0001,n+p[2]);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(n+p[2]+.03);
  }catch(e){}
}
function resetUI(){ $("lives").textContent="❤️❤️❤️";$("score").textContent="0";$("qCount").textContent="0/10";$("wave").textContent="1"; }
function updateLives(){$("lives").textContent="❤️".repeat(Math.max(0,lives))+"🖤".repeat(3-Math.max(0,lives))}
function init3D(){
  const root=$("world");root.innerHTML="";
  scene=new THREE.Scene();scene.background=new THREE.Color(0x9ddfda);scene.fog=new THREE.Fog(0x9ddfda,15,80);
  camera=new THREE.PerspectiveCamera(58,root.clientWidth/root.clientHeight,.1,120);camera.position.set(0,4.7,11);camera.lookAt(0,1,-8);
  renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(root.clientWidth,root.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;root.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xeaffff,0x335b3c,2));
  const sun=new THREE.DirectionalLight(0xfff1c5,2.4);sun.position.set(-5,12,7);sun.castShadow=true;scene.add(sun);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,110),new THREE.MeshStandardMaterial({color:0x63b96d,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.set(0,-.5,-32);scene.add(ground);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(7.5,110),new THREE.MeshStandardMaterial({color:0xcab57c,roughness:1}));road.rotation.x=-Math.PI/2;road.position.set(0,-.46,-32);scene.add(road);
  const tex=new THREE.TextureLoader();
  const sprite=(url,w,h)=>{
    const m=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,side:THREE.DoubleSide,depthWrite:false});
    tex.load(url,t=>{t.colorSpace=THREE.SRGBColorSpace;m.map=t;m.needsUpdate=true});return new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);
  };
  hero=sprite("assets/pikachu.png",2.15,2.15);hero.position.set(0,.85,3.4);hero.userData.base=.85;scene.add(hero);
  enemies=[];bolts=[];particles=[];trees=[];
  const treeCount=difficulty==="mudah"?18:difficulty==="sedang"?28:38;
  for(let i=0;i<treeCount;i++){
    const x=(Math.random()<.5?-1:1)*(5.2+Math.random()*10),z=5-Math.random()*85;
    const t=sprite(i%2?"assets/tree-a.png":"assets/tree-b.png",3.2,3.2);t.position.set(x,1.2,z);t.userData.speed=6+Math.random()*4;scene.add(t);trees.push(t);
  }
  for(let i=0;i<enemyCount();i++)spawnEnemy(true);
  clock=new THREE.Clock();worldTime=0;enemyTimer=0;
}
function enemyCount(){return difficulty==="mudah"?2:difficulty==="sedang"?3:4}
function spawnEnemy(initial=false){
  const m=new THREE.Mesh(new THREE.PlaneGeometry(2.0,2.0),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,side:THREE.DoubleSide,depthWrite:false}));
  new THREE.TextureLoader().load(Math.random()<.5?"assets/gengar.png":"assets/enemy.png",t=>{t.colorSpace=THREE.SRGBColorSpace;m.material.map=t;m.material.needsUpdate=true});
  m.position.set(Math.random()*7-3.5,.9,initial?-12-Math.random()*22:-48-Math.random()*18);
  m.userData={hp:difficulty==="sulit"?2:1,phase:Math.random()*10,attack:1+Math.random()*2};scene.add(m);enemies.push(m);
}
function sparkLine(){
  const pts=[new THREE.Vector3(hero.position.x,hero.position.y+.15,hero.position.z-1),new THREE.Vector3(hero.position.x+(Math.random()-.5)*.6,hero.position.y+.45,hero.position.z-2),new THREE.Vector3(hero.position.x+(Math.random()-.5)*.8,hero.position.y-.15,hero.position.z-3.1)];
  const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xffee3d}));scene.add(l);bolts.push({mesh:l,life:.16});beep("shoot");
}
function fireAtTarget(){
  // Pola permainan baru: PIKACHU MENEMBAK DULU.
  // Jika tembakan mengenai sasaran, soal langsung muncul.
  // Pemain harus menjawab benar untuk membuka tembakan berikutnya.
  if(!running||paused||awaitingAnswer||performance.now()-lastShot<330)return;
  lastShot=performance.now();

  const target=enemies
    .filter(e=>e.position.z<hero.position.z&&e.position.z>-32)
    .sort((a,b)=>Math.abs(a.position.x-hero.position.x)-Math.abs(b.position.x-hero.position.x))[0];

  const hitTarget=target && Math.abs(target.position.x-hero.position.x)<3.0 ? target : null;
  sparkLine();

  if(hitTarget){
    // Tembakan terjadi SEBELUM soal.
    hitTarget.userData.hp--;
    score+=15;
    if(hitTarget.userData.hp<=0){
      scene.remove(hitTarget);
      enemies=enemies.filter(e=>e!==hitTarget);
      kills++;
      score+=30;
    }
    $("score").textContent=score;

    // Jeda untuk menjawab soal setelah tembakan mengenai musuh.
    showQuiz();
  }
}
function jump(){if(!running||paused)return;targetY=2.5;beep("jump");setTimeout(()=>targetY=.85,650)}
function hurt(){
  if(invuln>0)return;invuln=1.2;lives--;updateLives();score=Math.max(0,score-10);$("score").textContent=score;beep("hit");if(lives<=0)endMission(false);
}
function enemyAttack(e){
  const p=new THREE.Mesh(new THREE.SphereGeometry(.14,8,8),new THREE.MeshBasicMaterial({color:0xff7454}));
  p.position.copy(e.position);p.userData={vx:(hero.position.x-e.position.x)*.7};scene.add(p);particles.push({mesh:p,life:2.2,hostile:true});
}
function loop(){
  animationFrame=requestAnimationFrame(loop);if(!renderer)return;const dt=Math.min(clock.getDelta(),.04);
  if(running&&!paused){
    worldTime+=dt;invuln=Math.max(0,invuln-dt);
    hero.position.x=THREE.MathUtils.lerp(hero.position.x,targetX,.13);hero.position.y=THREE.MathUtils.lerp(hero.position.y,targetY,.13);
    hero.position.z=3.4+Math.sin(worldTime*2.2)*.08;hero.material.opacity=invuln>0&&Math.floor(worldTime*16)%2?0.35:1;
    trees.forEach(t=>{t.position.z+=t.userData.speed*dt;if(t.position.z>8)t.position.z=-78-Math.random()*15});
    enemies.forEach(e=>{
      e.position.z+=(difficulty==="sulit"?8.1:difficulty==="sedang"?6.4:5.0)*dt;
      e.position.x+=Math.sin(worldTime*1.6+e.userData.phase)*dt*.7;e.lookAt(camera.position);
      e.userData.attack-=dt;if(e.userData.attack<=0&&e.position.z<hero.position.z-4){e.userData.attack=2.5+Math.random()*1.2;enemyAttack(e)}
      if(e.position.z>hero.position.z-1.0&&Math.abs(e.position.x-hero.position.x)<1.3){hurt();e.position.z=-42-Math.random()*10}
      if(e.position.z>9)e.position.z=-48-Math.random()*18;
    });
    enemyTimer+=dt;
    if(enemyTimer>(difficulty==="sulit"?2.1:3.0)&&enemies.length<enemyCount()){spawnEnemy();enemyTimer=0;wave++;$("wave").textContent=wave}
    bolts.forEach(b=>{b.life-=dt;if(b.life<=0)scene.remove(b.mesh)});bolts=bolts.filter(b=>b.life>0);
    particles.forEach(p=>{p.life-=dt;if(p.hostile){p.mesh.position.z+=10*dt;p.mesh.position.x+=p.mesh.userData.vx*dt;if(p.mesh.position.z>hero.position.z-1&&Math.abs(p.mesh.position.x-hero.position.x)<.8){hurt();p.life=0}}if(p.life<=0)scene.remove(p.mesh)});particles=particles.filter(p=>p.life>0);
  }
  camera.position.x=THREE.MathUtils.lerp(camera.position.x,hero?hero.position.x*.16:0,.05);camera.lookAt(camera.position.x*.25,1.1,-8);renderer.render(scene,camera);
}
function showQuiz(){
  if(questionIndex>=10){endMission(true);return}
  awaitingAnswer=true;
  $("preAttack").classList.add("hidden");
  $("quiz").classList.remove("hidden");
  const q=questions[questionIndex];
  $("quizSubject").textContent=subjectName[subject].toUpperCase();
  $("quizNo").textContent=`SOAL ${questionIndex+1}/10`;
  $("question").textContent=q.text;
  $("feedback").textContent="Jawab dengan teliti. Setelah BENAR, Pikachu dapat menembak lagi.";
  const box=$("answers");box.innerHTML="";
  q.options.forEach((opt,i)=>{
    const b=document.createElement("button");
    b.className="answer";
    b.textContent=`${String.fromCharCode(65+i)}. ${opt}`;
    b.onclick=()=>answer(i,b);
    box.appendChild(b)
  });
}
function answer(i,button){
  if(!awaitingAnswer)return;
  const q=questions[questionIndex];
  const buttons=[...$("answers").children];

  if(i===q.correct){
    awaitingAnswer=false;
    buttons.forEach((b,j)=>{b.disabled=true;if(j===q.correct)b.classList.add("correct")});
    button.classList.add("correct");
    score+=100;
    $("score").textContent=score;
    $("feedback").textContent="BENAR! ⚡ Pikachu siap menembak lagi! +100 poin";
    beep("correct");
    questionIndex++;
    $("qCount").textContent=`${questionIndex}/10`;

    setTimeout(()=>{
      $("quiz").classList.add("hidden");
      if(questionIndex>=10){
        endMission(true);
      }else{
        // Tembakan berikutnya baru dilakukan saat pemain menekan TEMBAK lagi.
        awaitingAnswer=false;
      }
    },900);
  }else{
    // Salah tidak mengakhiri soal. Poin berkurang dan anak diberi kesempatan mencoba lagi.
    score=Math.max(0,score-25);
    $("score").textContent=score;
    button.classList.add("wrong");
    button.disabled=true;
    $("feedback").textContent="Belum tepat. -25 poin. Coba lagi sampai benar.";
    beep("wrong");
  }
}
function beginAttackWindow(){
  // Dipertahankan agar kompatibel dengan versi sebelumnya.
  // Versi baru tidak memakai pemicu otomatis; setiap tembakan memanggil showQuiz().
}
function endMission(won){
  running=false;paused=false;awaitingAnswer=false;$("quiz").classList.add("hidden");$("preAttack").classList.add("hidden");$("pause").classList.add("hidden");$("result").classList.remove("hidden");
  const star=won?(score>=850?"⭐⭐⭐":score>=600?"⭐⭐":"⭐"):"⭐";
  $("resultIcon").textContent=won?"🏆":"💛";$("resultTitle").textContent=won?"Misi Berhasil!":"Pikachu Kehabisan Nyawa";$("resultText").textContent=won?`10 soal selesai • ${kills} musuh dibasmi • Mode ${mode.toUpperCase()}`:"Coba lagi: geser lebih cepat untuk menghindar dan jawab soal dengan teliti.";$("stars").textContent=star;$("finalScore").textContent=score;beep(won?"win":"hit");
}
function startGame(){
  grade=+$("grade").value;subject=$("subject").value;difficulty=document.querySelector("#difficulty .active").dataset.value;mode=document.querySelector("#mode .active").dataset.value;
  questions=makeQuestions();lives=3;score=0;questionIndex=0;kills=0;wave=1;running=true;paused=false;awaitingAnswer=false;targetX=0;targetY=.85;invuln=0;
  $("missionTitle").textContent="Hutan Listrik";$("missionSub").textContent=`Kelas ${grade} • ${subjectName[subject]} • ${mode.toUpperCase()}`;resetUI();show("game");$("pause").classList.add("hidden");$("result").classList.add("hidden");
  init3D();if(animationFrame)cancelAnimationFrame(animationFrame);loop();
  // Pikachu bebas menembak. Soal hanya muncul setelah tembakan mengenai musuh.
}
function home(){running=false;paused=false;$("pause").classList.add("hidden");$("result").classList.add("hidden");show("home")}
$("btnStart").onclick=()=>{beep("menu");show("setup")};$("btnBackHome").onclick=()=>show("home");
$("btnPlay").onclick=startGame;$("btnSound").onclick=()=>{soundOn=!soundOn;$("btnSound").textContent=soundOn?"🔊 Suara Aktif":"🔇 Suara Mati";if(soundOn)beep("menu")};
$("btnPause").onclick=()=>{if(running){paused=true;$("pause").classList.remove("hidden")}};$("btnResume").onclick=()=>{paused=false;$("pause").classList.add("hidden")};
$("btnGameHome").onclick=home;$("btnPauseHome").onclick=home;$("btnResultHome").onclick=home;$("btnAgain").onclick=startGame;
$("btnShoot").onpointerdown=e=>{e.preventDefault();fireAtTarget()};$("btnJump").onpointerdown=e=>{e.preventDefault();jump()};
$("world").addEventListener("pointerdown",e=>{if(!running||paused||!$("quiz").classList.contains("hidden"))return;pointer={x:e.clientX,y:e.clientY};$("world").setPointerCapture?.(e.pointerId)});
$("world").addEventListener("pointermove",e=>{if(!pointer||!hero||!running||paused)return;const dx=(e.clientX-pointer.x)/Math.max(1,$("world").clientWidth);targetX=THREE.MathUtils.clamp(targetX+dx*11,-4.2,4.2);pointer={x:e.clientX,y:e.clientY}});
$("world").addEventListener("pointerup",()=>{pointer=null});
$("world").addEventListener("click",e=>{if(running&&!paused&&$("quiz").classList.contains("hidden")&&!e.target.closest("button"))fireAtTarget()});
window.onkeydown=e=>{if(e.code==="Space")fireAtTarget();if(e.code==="ArrowLeft"||e.code==="KeyA")targetX=Math.max(-4.2,targetX-.7);if(e.code==="ArrowRight"||e.code==="KeyD")targetX=Math.min(4.2,targetX+.7);if(e.code==="ArrowUp"||e.code==="KeyW")jump();if(e.code==="Escape"&&running){paused=!paused;$("pause").classList.toggle("hidden",!paused)}};
window.onresize=()=>{if(renderer&&camera){const r=$("world");camera.aspect=r.clientWidth/r.clientHeight;camera.updateProjectionMatrix();renderer.setSize(r.clientWidth,r.clientHeight)}};
show("home");
