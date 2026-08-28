Primary interactive control for CTAs and links — use `primary` (coral fill) for the one main action per view, `dark` on cream sections needing higher contrast, `outline` for secondary actions, `ghost` for inline text links with an animated arrow.

```jsx
<Button variant="primary" size="md" onClick={submit}>Conocer más</Button>
<Button variant="outline">Contacto</Button>
<Button variant="ghost">Ver todos los proyectos</Button>
```

Variants: `primary`, `dark`, `outline`, `ghost`. Sizes: `sm`, `md`, `lg` (ghost ignores size — it's inline text). Never more than one `primary` button per screen section.
