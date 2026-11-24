(() => {
  const phoneSheetQuery = [
    "(max-width: 600px) and (pointer: coarse)",
    "(max-width: 480px)",
    "(max-width: 600px) and (max-aspect-ratio: 3 / 4)",
    "(pointer: coarse) and (max-height: 480px)"
  ].join(", ");

  const phoneSheetMedia = window.matchMedia(phoneSheetQuery);
  const enhancedSelects = new WeakMap();
  let activeSelect = null;
  let generatedId = 0;

  function getLabels(select) {
    const labels = Array.from(select.labels || []);
    return labels.map((label, index) => {
      if (!label.id) {
        label.id = `${select.id}-custom-label-${index + 1}`;
      }
      if (label.htmlFor === select.id) {
        label.htmlFor = `${select.id}-custom-trigger`;
      }
      return label;
    });
  }

  function initializeSelect(select) {
    if (select.dataset.customSelectEnhanced === "true") return;
    if (!select.id) {
      generatedId += 1;
      select.id = `control-panel-select-${generatedId}`;
    }

    const selectId = select.id;
    const labels = getLabels(select);
    const labelIds = labels.map(label => label.id);
    const accessibleName = labels.map(label => label.textContent.trim()).filter(Boolean).join(" ");
    const sourceFontSize = window.getComputedStyle(select).fontSize;
    const suggestionList = document.getElementById("suggestions");
    const dropdownFontSize = suggestionList
      ? window.getComputedStyle(suggestionList).fontSize
      : sourceFontSize;
    const wrapper = document.createElement("div");
    wrapper.className = "custom-select";
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.id = `${selectId}-custom-trigger`;
    trigger.classList.add("custom-select-trigger");
    select.classList.forEach(className => trigger.classList.add(className));
    trigger.style.fontSize = sourceFontSize;
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", `${selectId}-custom-options`);
    if (labelIds.length) {
      trigger.setAttribute("aria-labelledby", labelIds.join(" "));
    } else {
      trigger.setAttribute("aria-label", select.getAttribute("aria-label") || selectId);
    }
    const describedBy = select.getAttribute("aria-describedby");
    if (describedBy) trigger.setAttribute("aria-describedby", describedBy);

    const value = document.createElement("span");
    value.className = "custom-select-value";
    value.id = `${selectId}-custom-value`;
    const chevron = document.createElement("span");
    chevron.className = "custom-select-chevron";
    chevron.setAttribute("aria-hidden", "true");
    trigger.append(value, chevron);
    if (labelIds.length) {
      trigger.setAttribute("aria-labelledby", [...labelIds, value.id].join(" "));
    }

    const layer = document.createElement("div");
    layer.className = "custom-select-layer";
    layer.id = `${selectId}-custom-layer`;
    layer.setAttribute("aria-hidden", "true");

    const backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "custom-select-backdrop";
    backdrop.tabIndex = -1;
    backdrop.setAttribute("aria-label", `Close ${accessibleName || "selection"} options`);

    const menu = document.createElement("div");
    menu.className = "custom-select-menu";
    menu.id = `${selectId}-custom-menu`;
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-labelledby", labelIds.join(" ") || trigger.id);
    menu.style.fontSize = dropdownFontSize;

    const heading = document.createElement("div");
    heading.className = "custom-select-heading";
    heading.id = `${selectId}-custom-heading`;
    heading.textContent = accessibleName || select.getAttribute("aria-label") || "Choose an option";

    const optionsList = document.createElement("ul");
    optionsList.className = "custom-select-options";
    optionsList.id = `${selectId}-custom-options`;
    optionsList.setAttribute("role", "presentation");
    menu.append(heading, optionsList);
    layer.append(backdrop, menu);

    const parent = select.parentElement;
    parent.insertBefore(wrapper, select);
    wrapper.append(select, trigger);
    document.body.appendChild(layer);

    select.dataset.customSelectEnhanced = "true";
    select.classList.add("custom-select-native");
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");

    function getOptionRows() {
      return Array.from(optionsList.querySelectorAll('[role="option"]'));
    }

    function syncTrigger() {
      const option = select.selectedIndex >= 0 ? select.options[select.selectedIndex] : null;
      value.textContent = option ? option.label : (select.dataset.placeholder || "Select an option");
      trigger.title = value.textContent;
      trigger.disabled = select.disabled || !Array.from(select.options).some(item =>
        !item.disabled && !item.parentElement.disabled
      );
      getOptionRows().forEach(row => {
        const selected = Number(row.dataset.optionIndex) === select.selectedIndex;
        row.setAttribute("aria-selected", String(selected));
      });
    }

    function appendOption(option, index, inheritedDisabled = false) {
      const row = document.createElement("li");
      row.className = "custom-select-option";
      row.textContent = option.label;
      row.dataset.optionIndex = String(index);
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", String(index === select.selectedIndex));
      row.setAttribute("aria-disabled", String(inheritedDisabled || option.disabled));
      row.tabIndex = -1;
      optionsList.appendChild(row);
    }

    function renderOptions() {
      optionsList.replaceChildren();
      Array.from(select.children).forEach(child => {
        if (child.tagName === "OPTION") {
          appendOption(child, child.index);
          return;
        }
        if (child.tagName === "OPTGROUP") {
          if (child.label) {
            const groupHeading = document.createElement("li");
            groupHeading.className = "custom-select-group";
            groupHeading.textContent = child.label;
            groupHeading.setAttribute("role", "presentation");
            optionsList.appendChild(groupHeading);
          }
          Array.from(child.children).forEach(option => {
            if (option.tagName === "OPTION") {
              appendOption(option, option.index, child.disabled);
            }
          });
        }
      });
      if (!select.options.length) {
        const empty = document.createElement("li");
        empty.className = "custom-select-empty";
        empty.textContent = "No options available";
        empty.setAttribute("role", "presentation");
        optionsList.appendChild(empty);
      }
      syncTrigger();
    }

    function focusOption(index) {
      const rows = getOptionRows();
      const enabledRows = rows.filter(row => row.getAttribute("aria-disabled") !== "true");
      if (!enabledRows.length) return;
      const selectedRow = enabledRows.find(row => Number(row.dataset.optionIndex) === index);
      (selectedRow || enabledRows[0]).focus();
    }

    function positionMenu() {
      if (!activeSelect || activeSelect.select !== select || activeSelect.isSheet) return;
      const rect = trigger.getBoundingClientRect();
      const viewportPadding = 8;
      const menuWidth = Math.min(Math.max(rect.width, 160), window.innerWidth - viewportPadding * 2);
      const maxHeight = Math.max(100, Math.min(320, window.innerHeight * 0.5));
      menu.style.width = `${menuWidth}px`;
      menu.style.maxHeight = `${maxHeight}px`;
      optionsList.style.maxHeight = `${maxHeight}px`;
      const menuHeight = menu.getBoundingClientRect().height;
      const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
      const spaceAbove = rect.top - viewportPadding;
      const openAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;
      const top = openAbove
        ? Math.max(viewportPadding, rect.top - menuHeight)
        : Math.min(window.innerHeight - menuHeight - viewportPadding, rect.bottom);
      const left = Math.min(
        Math.max(viewportPadding, rect.left),
        window.innerWidth - menuWidth - viewportPadding
      );
      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;
    }

    function close(restoreFocus = false) {
      if (activeSelect?.select !== select) return;
      activeSelect = null;
      layer.classList.remove("is-open", "is-sheet");
      layer.setAttribute("aria-hidden", "true");
      layer.removeAttribute("role");
      layer.removeAttribute("aria-modal");
      layer.removeAttribute("aria-labelledby");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-controls", optionsList.id);
      document.body.classList.remove("custom-select-sheet-open");
      menu.style.removeProperty("top");
      menu.style.removeProperty("left");
      menu.style.removeProperty("width");
      menu.style.removeProperty("max-height");
      optionsList.style.removeProperty("max-height");
      if (restoreFocus && trigger.isConnected && trigger.getClientRects().length) {
        trigger.focus();
      }
    }

    function open() {
      if (trigger.disabled) return;
      if (activeSelect) activeSelect.close(false);
      renderOptions();
      const isSheet = phoneSheetMedia.matches;
      activeSelect = { select, wrapper, layer, close, isSheet, positionMenu };
      layer.classList.toggle("is-sheet", isSheet);
      layer.classList.add("is-open");
      layer.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");
      if (isSheet) {
        layer.setAttribute("role", "dialog");
        layer.setAttribute("aria-modal", "true");
        layer.setAttribute("aria-labelledby", heading.id);
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-controls", layer.id);
        document.body.classList.add("custom-select-sheet-open");
      } else {
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-controls", optionsList.id);
        positionMenu();
      }
      focusOption(select.selectedIndex);
    }

    function commitOption(row) {
      if (!row || row.getAttribute("aria-disabled") === "true") return;
      const optionIndex = Number(row.dataset.optionIndex);
      if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= select.options.length) return;
      const changed = select.selectedIndex !== optionIndex;
      select.selectedIndex = optionIndex;
      syncTrigger();
      close(true);
      if (changed) {
        select.dispatchEvent(new Event("input", { bubbles: true }));
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    trigger.addEventListener("click", () => {
      if (activeSelect?.select === select) close(false);
      else open();
    });

    trigger.addEventListener("keydown", event => {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        open();
        if (event.key === "ArrowUp") {
          const enabled = getOptionRows().filter(row => row.getAttribute("aria-disabled") !== "true");
          enabled.at(-1)?.focus();
        }
      }
    });

    menu.addEventListener("click", event => {
      const row = event.target.closest('[role="option"]');
      if (row && menu.contains(row)) commitOption(row);
    });

    menu.addEventListener("keydown", event => {
      const rows = getOptionRows().filter(row => row.getAttribute("aria-disabled") !== "true");
      const currentIndex = rows.indexOf(event.target);
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      } else if (event.key === "Tab") {
        close(true);
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (rows.length) {
          const step = event.key === "ArrowDown" ? 1 : -1;
          rows[(currentIndex + step + rows.length) % rows.length].focus();
        }
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        (event.key === "Home" ? rows[0] : rows.at(-1))?.focus();
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        commitOption(event.target.closest('[role="option"]'));
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const match = rows.find(row =>
          row.textContent.trim().toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase())
        );
        if (match) {
          event.preventDefault();
          match.focus();
        }
      }
    });

    backdrop.addEventListener("click", () => close(true));
    select.addEventListener("input", syncTrigger);
    select.addEventListener("change", syncTrigger);

    const optionObserver = new MutationObserver(() => {
      renderOptions();
      if (activeSelect?.select === select) positionMenu();
    });
    optionObserver.observe(select, {
      attributes: true,
      attributeFilter: ["disabled", "label", "selected"],
      childList: true,
      subtree: true
    });

    syncTrigger();
    return { select, wrapper, layer, close, positionMenu, syncTrigger, trigger };
  }

  function initializeAll() {
    document.querySelectorAll("select").forEach(select => {
      const instance = initializeSelect(select);
      if (instance) enhancedSelects.set(select, instance);
    });
  }

  window.syncCustomSelect = selectOrId => {
    const select = typeof selectOrId === "string"
      ? document.getElementById(selectOrId)
      : selectOrId;
    if (select instanceof HTMLSelectElement) {
      enhancedSelects.get(select)?.syncTrigger();
    }
  };

  document.addEventListener("pointerdown", event => {
    if (!activeSelect) return;
    if (activeSelect.wrapper.contains(event.target) || activeSelect.layer.contains(event.target)) return;
    activeSelect.close(false);
  }, true);

  document.addEventListener("scroll", () => activeSelect?.positionMenu(), true);
  window.addEventListener("resize", () => {
    if (!activeSelect) return;
    if (activeSelect.isSheet !== phoneSheetMedia.matches) {
      activeSelect.close(false);
      return;
    }
    activeSelect.positionMenu();
  });
  phoneSheetMedia.addEventListener?.("change", () => {
    if (activeSelect && activeSelect.isSheet !== phoneSheetMedia.matches) {
      activeSelect.close(false);
    }
  });

  if (document.readyState !== "complete") {
    window.addEventListener("DOMContentLoaded", initializeAll, { once: true });
  } else {
    initializeAll();
  }
})();
