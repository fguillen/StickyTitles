class StickyTitles {
  constructor(titlesSelector, containerSelector, distanceFromTopDetection) {
    this.titles = Array.from(document.querySelectorAll(titlesSelector));
    this.container = document.querySelector(containerSelector);

    // Security buffer number to check if the intersection has happened in the top of the container
    this.distanceFromTopDetection = distanceFromTopDetection;
  }

  start() {
    this.setAllTitlesSticky();
    let observer = new IntersectionObserver(this.observerCallback.bind(this), this.observerOptions());
    this.titles.forEach( (e) => observer.observe(e) );
  }

  setAllTitlesSticky() {
    this.titles.forEach((e) => {
      e.style.position = "sticky";
      e.style.top = "0px";
      e.style.zIndex = "9999";
    });
  }

  observerOptions() {
    console.log("this.container:", this.container);
    const containerPaddingTop = window.getComputedStyle(this.container).getPropertyValue("padding-top");
    const containerPaddingTopInPx = parseInt(containerPaddingTop);
    console.log("containerPaddingTop:", containerPaddingTop);
    console.log("containerPaddingTopInPx:", containerPaddingTopInPx);

    return {
      root: this.container,
      rootMargin: `-${containerPaddingTopInPx + 10}px 0px 0px 0px`,
      threshold: [1],
    };
  }

  observerCallback(entries, _observer) {
    console.log("observerCallback");

    // Each entry describes an intersection change for one observed
    // target element:
    //   entry.boundingClientRect
    //   entry.intersectionRatio
    //   entry.intersectionRect
    //   entry.isIntersecting
    //   entry.rootBounds
    //   entry.target
    //   entry.time
    entries.forEach( (e) => this.intersectionEvent(e) );
  }

  intersectionEvent(entry) {
    const isIntersecting = entry.isIntersecting;
    const top = entry.boundingClientRect.top;

    console.log("intersectionEvent:", entry.target.innerText);
    console.log("isIntersecting:", isIntersecting);
    console.log("top:", top);

    console.log("intersectionRect.top:", entry.intersectionRect.top);
    console.log("rootBounds.top:", entry.rootBounds.top);

    console.log("intersectionRect.bottom:", entry.intersectionRect.bottom);
    console.log("rootBounds.bottom:", entry.rootBounds.bottom);

    if (isIntersecting && Math.abs(entry.intersectionRect.top - entry.rootBounds.top) < this.distanceFromTopDetection) {
      this.delinkTop(entry.target);
    } else if (!isIntersecting && Math.abs(entry.intersectionRect.top - entry.rootBounds.top) < this.distanceFromTopDetection) {
      this.linkTop(entry.target)
    }
  }
  linkTop(element) {
    console.log("linkTop:", element);
    this.allPreviousElementsTransparent(element, this.titles);
    this.allNextElementsVisible(element, this.titles);
    this.elementVisible(element)
  }

  delinkTop(element) {
    console.log("delinkTop:", element);
    this.previousElementVisible(element, this.titles);
  }

  allPreviousElementsTransparent(element) {
    console.log("allPreviousElementsTransparent:", element);
    const index = this.indexElement(element);
    console.log("index:", index);

    // First element has not previous
    if (index === 0) return;

    const previousElements = this.titles.slice(0, index);
    previousElements.forEach((e) => this.elementTransparent(e));
  }

  allNextElementsVisible(element) {
    console.log("allNextElementsVisible:", element);
    const index = this.indexElement(element);

    // Last element has not next
    if (index === this.titles.size - 1) return;

    const nextElements = this.titles.slice(index + 1);
    nextElements.forEach((e) => this.elementVisible(e));
  }

  previousElementVisible(element) {
    console.log("previousElementVisible:", element);

    // First element has not previous
    if (this.indexElement(element) === 0) return;

    const previousElement = this.titles[this.indexElement(element) - 1];
    this.elementVisible(previousElement)
  }

  elementVisible(element) {
    console.log("elementVisible:", element);
    element.classList.remove("transparent");
    element.classList.add("visible");
  }

  elementTransparent(element) {
    console.log("elementTransparent:", element);
    element.classList.remove("visible");
    element.classList.add("transparent");
  }

  indexElement(element) {
    const result =
      this.titles.findIndex((familyElement) => {
        return familyElement == element;
      });

    return result;
  }
}

// new StickyTitles(".message.role-user", "#messages-list", 200).start();

new StickyTitles("h1", "#container", 20).start();
