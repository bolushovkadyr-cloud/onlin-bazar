(function () {
  const $ = (s) => document.querySelector(s);

  // Курстун бөлүмдөрү
  const mods = [
    ["Араб алиппеси", "ا"], ["Араб тамгалары", "ب"], ["Куран окуу", "ق"], ["Тажвид", "ت"],
    ["Махраж", "خ"], ["Мадд", "م"], ["Гунна", "ن"], ["Идгам", "د"], ["Ихфа", "ف"],
    ["Иклаб", "ب"], ["Изхар", "ظ"], ["Сүрө жаттоо", "س"], ["Кайталоо жана практика", "ر"]
  ];
  $("#modules").innerHTML = mods
    .map((m) => `<div class="card mod"><span class="ar">${m[1]}</span>${m[0]}</div>`)
    .join("");

  // Мобилдик меню
  const burger = $("#burger"), menu = $("#menu");
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    menu.classList.toggle("open");
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      menu.classList.remove("open");
    })
  );

  // Dark / light mode
  const root = document.documentElement, themeBtn = $("#themeBtn");
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
    try { localStorage.setItem("theme", t); } catch (e) {}
  }
  let saved = "light";
  try { saved = localStorage.getItem("theme") || "light"; } catch (e) {}
  setTheme(saved);
  themeBtn.addEventListener("click", () =>
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark")
  );

  // Progress bar — экранга чыкканда толтурулат
  const bars = document.querySelectorAll(".bar i");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + "%";
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach((b) => io.observe(b));

  // Форма
  const f = {
    name: $("#name"), phone: $("#phone"), gender: $("#gender"),
    course: $("#course"), pack: $("#pack"), disc: $("#disc")
  };

  function calc() {
    const price = Number(f.pack.value) || 0;
    const d = Number(f.disc.value) || 0;
    const total = Math.round(price * (1 - d / 100));
    $("#total").textContent = total.toLocaleString("ru-RU") + " сом" + (d ? " (−" + d + "%)" : "");
  }
  f.pack.addEventListener("change", calc);
  f.disc.addEventListener("change", calc);

  // Баскычтардан форманы алдын ала толтуруу
  document.querySelectorAll("[data-gender]").forEach((b) =>
    b.addEventListener("click", () => { f.gender.value = b.dataset.gender; })
  );
  const packMap = { 1: "1500", 3: "4000", 6: "7000" };
  document.querySelectorAll("[data-pack]").forEach((b) =>
    b.addEventListener("click", () => { f.pack.value = packMap[b.dataset.pack]; calc(); })
  );

  function setErr(el, msg) {
    const err = el.parentElement.querySelector(".err");
    err.textContent = msg;
    el.classList.toggle("bad", !!msg);
    return !msg;
  }

  $("#regForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const phoneOk = /^\+?[0-9\s\-()]{9,16}$/.test(f.phone.value.trim());
    const results = [
      setErr(f.name, f.name.value.trim().length < 3 ? "Аты-жөнүңүздү толук жазыңыз" : ""),
      setErr(f.phone, phoneOk ? "" : "Телефон номерин туура жазыңыз"),
      setErr(f.gender, f.gender.value ? "" : "Тандаңыз"),
      setErr(f.course, f.course.value ? "" : "Курсту тандаңыз"),
      setErr(f.pack, f.pack.value ? "" : "Пакетти тандаңыз")
    ];
    const ok = $("#ok");
    if (results.every(Boolean)) {
      ok.hidden = false;
      ok.scrollIntoView({ behavior: "smooth", block: "center" });
      e.target.reset();
      calc();
    } else {
      ok.hidden = true;
    }
  });
})();
