The folder structure was designed to balance [locality of behaviour](https://htmx.org/essays/locality-of-behaviour/#:~:text=The%20primary%20feature%20for%20easy%20maintenance%20is%20locality%3A%20Locality%20is%20that%20characteristic%20of%20source%20code%20that%20enables%20a%20programmer%20to%20understand%20that%20source%20by%20looking%20at%20only%20a%20small%20portion%20of%20it) and abstraction the in daybreak web projects.

`/components`

- ✅ In this folder:
    - Think *organisms* in atomic design, a group of ui that is context-agonistic but has a complex logic.
    - With more specialized function, while `ui` is more function agnostic.
    - eg: Carousel, Filter Search
- ❌ Not in this folder:
    - Page specific or section specific components

💡 Rule of thumbs

- Is the components being used more than once in the project?
    - Yes: definitely put it here ✅
    - No: Default to route private `_`, Put it here if you think this is generic enough to have the potential to be reused (caution)
- Does the component depends on the product/website context?
    - Yes: Don’t put it here, put it under `_`
    - No: Default to route private `_` , but ✅
- Can this component be used in other projects as well with the same client?
    - Yes: then put it here!
    - No: Default to route private `_`

`/components/ui/`

- ✅ In this folder:
    - *Atomic* level components or your design system elements
    - eg. Button, Textfield, Scrim, AnimationConfig, FadeInText(superpower)
- ❌ Not in this folder:
    - Complex design system components: eg - carousel, search with auto complete.

`/pages`

- ✅ In this folder: NextJS pages and sub pages directories (because we uses page router for framer motion route animation)
- for page specific components and logic, put them inside a private `_` folder
    - for example, you have a ScrollVideo that is only going to be used once on the website, put it under the `_`.
    - Default to using the private folder, except there is specific reason.
- Example structure
    - `/pages/about/index.tsx` *(for the page)*
    - `/pages/about/_/3DScene/...` *(private components that group with the page)*
    - `/pages/about/_/SceneNavigation/...`

---

`/hooks`

- ✅ In this folder: Hooks that can be used globally
- ❌ Not in this folder: For component specific hooks that is written for organisation purpose, put those under the private `_` folder.

`/utils`

- ✅ In this folder: Javascript utilities, eg. map(v,start,end), clamp, convertTimeString
