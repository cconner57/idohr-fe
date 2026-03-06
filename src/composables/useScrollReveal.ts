const observers = new Map<string, IntersectionObserver>()

function getObserver(className: string, threshold: number): IntersectionObserver {
  const key = `${className}-${threshold}`
  let obs = observers.get(key)
  if (!obs) {
    obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
            obs?.unobserve(entry.target)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      },
    )
    observers.set(key, obs)
  }
  return obs
}

export function useScrollReveal(className = 'reveal', threshold = 0.1) {
  const observer = getObserver(className, threshold)

  const vScrollReveal = {
    mounted: (el: HTMLElement) => {
      el.classList.add(className)
      observer.observe(el)
    },
    unmounted: (el: HTMLElement) => {
      observer.unobserve(el)
    },
  }

  return {
    vScrollReveal,
  }
}
