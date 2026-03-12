<script lang="ts">
import { cloneVNode, Comment, defineComponent, mergeProps } from 'vue';

export default defineComponent({
  name: 'PrimitiveSlot',
  inheritAttrs: false,

  setup(_, { attrs, slots }) {
    return () => {
      const children = slots.default?.();

      if (!children?.length) return null;

      const child = children.find((v) => v.type !== Comment);

      if (!child) return null;

      const props = child.props ? mergeProps(attrs, child.props) : attrs;

      return cloneVNode(child, props);
    };
  }
});
</script>
