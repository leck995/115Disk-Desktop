<script setup lang="ts">
import { getHeaders, type HeaderItem } from '@vuepress/helper/client'
import { onContentUpdated, useRoute } from 'vuepress/client'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const route = useRoute()
const headers = ref<HeaderItem[]>([])
const activeLink = ref('')

const tocItems = computed(() => {
  const list = headers.value
  // 若首个 h1 仅包裹全文，优先展示其子标题
  if (list.length === 1 && list[0]?.level === 1 && list[0].children?.length) {
    return list[0].children
  }
  return list
})

const hasToc = computed(() => tocItems.value.length > 0)

const updateHeaders = (): void => {
  headers.value = getHeaders({
    levels: [2, 3],
    ignore: ['.vp-badge'],
  })
}

const collectLinks = (items: HeaderItem[]): string[] =>
  items.flatMap((item) => [item.link, ...collectLinks(item.children ?? [])])

let observer: IntersectionObserver | null = null

const setupObserver = (): void => {
  observer?.disconnect()
  observer = null

  if (typeof window === 'undefined' || !hasToc.value) return

  const links = collectLinks(tocItems.value)
  const elements = links
    .map((link) => {
      const id = decodeURIComponent(link.replace(/^#/, ''))
      return document.getElementById(id)
    })
    .filter((el): el is HTMLElement => !!el)

  if (!elements.length) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visible[0]?.target?.id) {
        activeLink.value = `#${visible[0].target.id}`
      }
    },
    {
      rootMargin: '-80px 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 1],
    },
  )

  elements.forEach((el) => observer?.observe(el))

  if (route.hash) {
    activeLink.value = decodeURIComponent(route.hash)
  } else if (links[0]) {
    activeLink.value = links[0]
  }
}

onContentUpdated((reason) => {
  if (reason === 'beforeUnmount') {
    headers.value = []
    observer?.disconnect()
    observer = null
    return
  }
  updateHeaders()
  requestAnimationFrame(() => setupObserver())
})

watch(
  () => route.path,
  () => {
    activeLink.value = ''
  },
)

watch(
  () => route.hash,
  (hash) => {
    if (hash) activeLink.value = decodeURIComponent(hash)
  },
)

onMounted(() => {
  updateHeaders()
  requestAnimationFrame(() => setupObserver())
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <aside v-if="hasToc" class="page-toc" aria-label="本页目录">
    <div class="page-toc__title">本页目录</div>
    <nav class="page-toc__nav">
      <ul class="page-toc__list">
        <li
          v-for="item in tocItems"
          :key="item.link"
          class="page-toc__item"
          :class="[`level-${item.level}`, { active: activeLink === item.link }]"
        >
          <a class="page-toc__link" :href="item.link">{{ item.title }}</a>
          <ul v-if="item.children?.length" class="page-toc__list">
            <li
              v-for="child in item.children"
              :key="child.link"
              class="page-toc__item"
              :class="[
                `level-${child.level}`,
                { active: activeLink === child.link },
              ]"
            >
              <a class="page-toc__link" :href="child.link">{{ child.title }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>
