<script setup>
import { ref, computed } from "vue";

// TODO: cseréld ki a logó tényleges elérési útjára
const logoSrc = "./icons/logo.png";

// A szülő komponens dönti el, mi történjen sikeres belépés után
const emit = defineEmits(["login"]);

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const invalid = ref({ user: false, pass: false });
const error = ref("");
const loading = ref(false);

const userInput = ref(null);
const passInput = ref(null);

const toggleLabel = computed(() =>
  showPassword.value ? "Jelszó elrejtése" : "Jelszó megjelenítése"
);

function clearError(field) {
  invalid.value[field] = false;
  error.value = "";
}

async function onSubmit() {
  const userMissing = !username.value.trim();
  const passMissing = !password.value.trim();
  invalid.value = { user: userMissing, pass: passMissing };

  if (userMissing || passMissing) {
    error.value =
      userMissing && passMissing
        ? "Add meg a felhasználónevet és a jelszót."
        : userMissing
          ? "Add meg a felhasználónevet."
          : "Add meg a jelszót.";
    (userMissing ? userInput : passInput).value?.focus();
    return;
  }

  loading.value = true;
  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value,
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      error.value = data.error || "Sikertelen bejelentkezés.";
      invalid.value = { user: true, pass: true };
      passInput.value?.focus();
      return;
    }

    // Sikeres belépés
    emit("login", data.user);
  } catch {
    error.value = "A szerver nem érhető el.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <main class="card">
     <img  class="brand"
        src="./icons/logo.png"
        width="1700"
        height="600"
        alt="StockAid – Warehouse Management"
         />

      <h1 class="sr-only">Bejelentkezés</h1>

      <form novalidate @submit.prevent="onSubmit">
        <div class="field">
          <label for="user">Felhasználónév</label>
          <div class="control">
            <input
              id="user"
              ref="userInput"
              v-model="username"
              name="user"
              type="text"
              autocomplete="username"
              autocapitalize="none"
              spellcheck="false"
              required
              :aria-invalid="invalid.user || undefined"
              @input="clearError('user')"
            />
          </div>
        </div>

        <div class="field">
          <label for="pass">Jelszó</label>
          <div class="control has-toggle">
            <input
              id="pass"
              ref="passInput"
              v-model="password"
              name="pass"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              :aria-invalid="invalid.pass || undefined"
              @input="clearError('pass')"
            />
            <button
              class="toggle"
              type="button"
              :aria-label="toggleLabel"
              :aria-pressed="showPassword"
              @click="showPassword = !showPassword"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        <p v-if="error" class="error" role="alert">{{ error }}</p>

        <button class="submit" type="submit" :disabled="loading">
          {{ loading ? "Bejelentkezés…" : "Bejelentkezés" }}
        </button>
      </form>
    </main>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&display=swap");

html, body { height: 100%; margin: 0; }
</style>

<style scoped>
.login-page {
  --page: #f3f5f8; --navy: #142a3f; --navy-2: #1d374f; --navy-line: #2c4964;
  --orange: #f08a3c; --orange-hover: #ff9a50; --on-orange: #1a1208;
  --field: #ffffff; --field-text: #142a3f; --placeholder: #7d8d9e;
  --label: #a9bacb; --error: #ff8f8f;

  font-family: "Lexend", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 15px;
  line-height: 1.45;
  min-height: 100%;
  box-sizing: border-box;
  background: var(--page);
  display: grid;
  place-items: center;
  padding: calc(16px + env(safe-area-inset-top, 0px)) 16px calc(16px + env(safe-area-inset-bottom, 0px));
}
@media (prefers-color-scheme: dark) {
  :global(:root:not([data-theme="light"])) .login-page { --page: #0b1621; --navy: #122639; --navy-line: #294660; }
}
:global(:root[data-theme="dark"]) .login-page { --page: #0b1621; --navy: #122639; --navy-line: #294660; }

.login-page *, .login-page *::before, .login-page *::after { box-sizing: border-box; }
button, input { font: inherit; }
:focus-visible { outline: 3px solid var(--orange); outline-offset: 2px; }

.card {
  width: 100%; max-width: 400px; background: var(--navy); color: #fff;
  border-radius: 24px; padding: 36px 32px 32px;
}
.brand {
  display: block; width: 100%; max-width: 340px; height: auto; aspect-ratio: 17 / 6;
  margin: -8px auto 22px; border-radius: 12px;
}
.sr-only {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap;
}

form { display: grid; gap: 14px; }
.field { display: grid; gap: 6px; }
.field label { font-size: 13px; color: var(--label); padding-left: 2px; }
.control { position: relative; }
.control input {
  width: 100%; height: 52px; border: 2px solid transparent; border-radius: 12px;
  background: var(--field); color: var(--field-text); padding: 0 16px; font-size: 16px;
}
.control input::placeholder { color: var(--placeholder); }
.control input:focus { outline: none; border-color: var(--orange); }
.control input[aria-invalid="true"] { border-color: var(--error); }
.control.has-toggle input { padding-right: 52px; }
.toggle {
  position: absolute; right: 6px; top: 6px; width: 40px; height: 40px; border: 0; border-radius: 8px;
  background: transparent; color: #5c6f82; cursor: pointer; display: grid; place-items: center;
}
.toggle:hover { background: #eef2f6; }
.toggle svg { width: 22px; height: 22px; }
.error { min-height: 20px; margin: 0; font-size: 13px; color: var(--error); padding-left: 2px; }

.submit {
  margin-top: 10px; height: 54px; border: 0; border-radius: 12px;
  background: var(--orange); color: var(--on-orange);
  font-size: 18px; font-weight: 600; cursor: pointer;
  transition: background .15s, transform .1s;
}
.submit:hover { background: var(--orange-hover); }
.submit:active { transform: translateY(1px); }

@media (max-width: 480px) {
  .card { padding: 28px 20px 24px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
</style>