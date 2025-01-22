export const groupMaterialsBySessionId = (materials = []) => {
   const result = materials.reduce((acc, material) => {
      const { sessionId } = material;
      if (!acc[sessionId]) {
         acc[sessionId] = {
            sessionId,
            sessionTitle: material?.sessionTitle,
            materials: [],
         };
      }
      acc[sessionId].materials.push(material);
      return acc;
   }, {});
   return Object.values(result);
};
