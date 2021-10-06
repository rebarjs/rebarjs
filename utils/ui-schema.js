class UISchema {
  constructor() {
    this.uiSchema = {}
  }

  createNode(as, props = { required: false, children: [] }) {
    this.uiSchema[this.generateNextKey()] = new UISchemaNode(as, props)
  }

  addNode(node) {
    this.uiSchema[this.generateNextKey()] = node
  }

  getUISchema() {
    const schema = {}

    Object.keys(this.uiSchema).forEach((node, index) => {
      schema[index] = this.uiSchema[node].node
    })

    return schema
  }

  getNodes() {
    return this.uiSchema
  }

  generateNextKey() {
    return Object.keys(this.uiSchema).length
  }
}

class UISchemaNode {
  constructor(as, props = { required: false, children: [] }, label = null) {
    this.node = {
      as,
      label,
      props,
    }
  }

  setChildren(children) {
    this.node.props.children = children
  }

  setFieldOptions(props) {
    this.node.props = props
  }

  getSchema() {
    const schema = {
      as: this.node.as,
      props: this.node.props,
    }

    this.node.props.children.forEach((child) => {
      schema.props.children.push(child)
    })

    return schema
  }

  getNode() {
    return this.node
  }

  getChildren() {
    return this.node.props.children
  }

  getFieldOptions() {
    return this.node.props
  }

  getComponent() {
    return this.node.as
  }
}

export { UISchema, UISchemaNode }
