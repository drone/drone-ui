<template>
    <label class="base-checkbox">
        <div>
            <slot></slot>
        </div>
        <input type="checkbox"
            :checked="value"
            @change="$emit('input', $event.target.checked)"
        />
        <span class="checkmark"></span>
    </label>
</template>

<script>
export default {
  name: "BaseCheckbox",
  props: [ "value" ],
};
</script>

<style scoped>
label {
    display: block;
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    font-size: 13px;
    line-height: 20px;
    user-select: none;
}

input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    border: 1px solid #e8eaed;
    border-radius: 3px;
}

label:hover input ~ .checkmark {
    border-color: #0060da;
}

label input:checked ~ .checkmark {
    background-color: #0060da;
    border-color: #0060da;
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

label input:checked ~ .checkmark:after {
    display: block;
}

label .checkmark:after {
    left: 6px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

label > div {
    display: inline-block;
}
</style>
