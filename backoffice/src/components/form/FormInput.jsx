// rfce
function FormInput({ register, name, type="text", errors }) {
  // console.log(errors[name].message);
  //    || first true      && first false
  return (
    <div>
      <input
        placeholder={name}
        type={type}
        {...register(name)}
        className="border w-full border-gray-400 
      rounded-md p-1 px-4"
      />
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name].message}</p>
      )}
    </div>
  );
}
export default FormInput;
