<script setup lang="ts"></script>

<template>
  <div id="header">
    <span id="logo-name" class="size-32">GAME<br />TRAILERS</span>
    <div id="search">
      <input
        id="search-input"
        class="size-16"
        type="text"
        placeholder="Поиск.."
      />
      <button id="search-icon">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 29 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.1111 6.16667C16.9464 6.16667 20.0556 9.27581 20.0556 13.1111M20.9706 20.9651L27 27M24.2222 13.1111C24.2222 19.2476 19.2476 24.2222 13.1111 24.2222C6.97461 24.2222 2 19.2476 2 13.1111C2 6.97461 6.97461 2 13.1111 2C19.2476 2 24.2222 6.97461 24.2222 13.1111Z"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <div id="tags">
      <button id="tags-text" class="size-22">Фильтр</button>
      <button id="tags-icon">
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 6H19M21 12H16M21 18H16M7 20V13.5612C7 13.3532 7 13.2492 6.97958 13.1497C6.96147 13.0615 6.93151 12.9761 6.89052 12.8958C6.84431 12.8054 6.77934 12.7242 6.64939 12.5617L3.35061 8.43826C3.22066 8.27583 3.15569 8.19461 3.10948 8.10417C3.06849 8.02393 3.03853 7.93852 3.02042 7.85026C3 7.75078 3 7.64677 3 7.43875V5.6C3 5.03995 3 4.75992 3.10899 4.54601C3.20487 4.35785 3.35785 4.20487 3.54601 4.10899C3.75992 4 4.03995 4 4.6 4H13.4C13.9601 4 14.2401 4 14.454 4.10899C14.6422 4.20487 14.7951 4.35785 14.891 4.54601C15 4.75992 15 5.03995 15 5.6V7.43875C15 7.64677 15 7.75078 14.9796 7.85026C14.9615 7.93852 14.9315 8.02393 14.8905 8.10417C14.8443 8.19461 14.7793 8.27583 14.6494 8.43826L11.3506 12.5617C11.2207 12.7242 11.1557 12.8054 11.1095 12.8958C11.0685 12.9761 11.0385 13.0615 11.0204 13.1497C11 13.2492 11 13.3532 11 13.5612V17L7 20Z"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/mixin.scss';
#header {
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#logo-name {
  font-size: 32px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
#search {
  max-width: 50vw;
  width: 100%;
  height: 40px;
  position: relative;
}
#search-input {
  height: 100%;
  width: 100%;
  padding: 5px;
  &:focus {
    outline: 2px solid black;
  }
}
#search-icon {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 15px;
  top: 4.5px;
  cursor: pointer;
  color: #e89191;
  @media (hover: hover) {
    &:hover {
      color: #f95555;
    }
  }
  @include button-click;
}

#tags-text {
  display: inline-block;
  color: rgb(255, 255, 255);
  font-size: 22px;
  font-weight: 600;
  filter: brightness(0.8);
  cursor: pointer;
  @media (hover: hover) {
    &:hover {
      filter: brightness(1);
    }
  }
  &:active {
    filter: brightness(1);
  }
  @include button-click;
}
#tags-icon {
  display: none;
}

@media (max-width: 768px) {
  #header {
    padding: 20px 20px;
  }
  #search {
    height: 30px;
  }
  #search-input:focus + #search-icon {
    color: #f95555;
  }

  #search-icon {
    width: 25px;
    height: 25px;
    top: 3px;
  }
}
@media (max-width: 480px) {
  #header {
    padding: 20px 10px;
  }
  #search {
    height: 25px;
  }
  #search-icon {
    width: 20px;
    height: 20px;
    top: 2.5px;
  }
  #tags-text {
    display: none;
  }
  #tags-icon {
    display: inline-block;
    height: 25px;
    @include button-click;
    svg {
      margin-top: 2.5px;
    }
  }
}
</style>
