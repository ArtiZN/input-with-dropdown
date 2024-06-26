// work with classNames easily
export const cn = (...args: (string | boolean | null | undefined)[]): string => {
    const classNames = args.filter(item => {
      if (typeof item === 'boolean') return false
      if (!item) return false
      if (!item.trim()) return false
      return true
    })
    return classNames.join(' ')
  }
  