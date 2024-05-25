export interface IMapper<T, D> {
  mapTo(valueToMap: T): D;
}
