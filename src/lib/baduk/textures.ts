const textures = new Map<string, Promise<HTMLImageElement>>()

/** Cache both in-flight and decoded images across board instances. */
export function loadTexture(url: string): Promise<HTMLImageElement> {
  const cached = textures.get(url)
  if (cached) return cached
  const pending = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The board texture could not be loaded.'))
    image.src = url
  })
  textures.set(url, pending)
  return pending
}
