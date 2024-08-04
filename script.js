class StickyTitles {
  constructor(titlesSelector, containerSelector) {
    this.titles = document.querySelectorAll(titlesSelector);
    this.container = document.querySelector(containerSelector);
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
    return {
      root: this.container,
      rootMargin: "-100px 0px 0px 0px", // 20 pixels (magic number) from top margin intersection starts
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

    const magicNumber = 400; // I hate this but I don't know how to do it better
    if (isIntersecting && top < magicNumber) {
      this.delinkTop(entry.target);
    } else if (!isIntersecting && top < magicNumber) {
      this.linkTop(entry.target)
    }
  }
  linkTop(element) {
    console.log("linkTop:", element);
    this.allPreviousElementsTransparent(element, this.titles);
  }

  delinkTop(element) {
    console.log("delinkTop:", element);
    this.previousElementVisible(element, this.titles);
  }

  allPreviousElementsTransparent(element, familyElements) {
    console.log("allPreviousElementsTransparent:", element);

    for (const familyElement of familyElements) {
      if (familyElement == element) {
        break;
      } else {
        familyElement.classList.remove("visible");
        familyElement.classList.add("transparent");
      }
    };
  }

  previousElementVisible(element, familyElements) {
    console.log("previousElementVisible:", element);

    familyElements = Array.from(familyElements);
    const indexElement =
      familyElements.findIndex((familyElement) => {
        return familyElement == element;
      });

    // First element has not previous
    if (indexElement === 0) {
      return;
    }

    const previousElement = familyElements[indexElement - 1];
    previousElement.classList.remove("transparent");
    previousElement.classList.add("visible");
  }
}

new StickyTitles(".message.role-user", "#message-list").start();

new StickyTitles("h1", "#container").start();
